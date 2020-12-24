import { getSession } from 'next-auth/client';
import { Daglig } from '../../../models/daglig';
import dbConnect from '../../../utils/db-connect';

export default async (req, res) => {
  if (req.method === 'DELETE') {
    const session = await getSession({ req });
    if (!session || !session.user?.id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'no active session',
      });
    }
    const userId = session.user.id;
    const favoriteId = req.query.id;

    if (!userId || !favoriteId) {
      return res.status(400).json({
        statusCode: 400,
        message: 'missing some information to remove',
      });
    }
    await dbConnect();
    const daglig = await Daglig.findOne({ userid: { $eq: userId } });
    if (!daglig) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'daglig not found' });
    }
    const favoriteIndex = daglig.favorites.findIndex(
      (f) => `${f._id}` === favoriteId
    );
    if (favoriteIndex === -1) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'favorite not found' });
    } else {
      daglig.favorites.splice(favoriteIndex, 1);
    }
    await daglig.save();

    res.status(201).json({
      statusCode: 201,
    });
  } else {
    res.setHeader('Allow', 'DELETE');
    res.status(405).end('method not allowed');
  }
};
