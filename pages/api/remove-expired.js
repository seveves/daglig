import jwt from 'jsonwebtoken';
import { Daglig } from '../../models/daglig';
import dbConnect from '../../utils/db-connect';
import { ttlExpired } from '../../utils/ttl';

export default async (req, res) => {
  if (req.method === 'GET') {
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ statusCode: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ statusCode: 401 });
    }
    try {
      jwt.verify(token, process.env.DAGLIG_JWT_SECRET);
    } catch (err) {
      console.error('jwt verify error', err);
      return res.status(401).json({ statusCode: 401 });
    }

    await dbConnect();
    const dagligs = await Daglig.find({});
    const toDelete = dagligs
      .filter((daglig) => {
        const { expired } = ttlExpired(new Date(), daglig);
        return expired;
      })
      .map((d) => d._id);
    await Daglig.deleteMany({
      _id: {
        $in: toDelete,
      },
    });
    res.status(200).json({ statusCode: 200, toDelete });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('method not allowed');
  }
};
