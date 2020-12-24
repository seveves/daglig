import { getSession } from 'next-auth/client';
import { Daglig } from '../../../models/daglig';
import dbConnect from '../../../utils/db-connect';
import mongoose from 'mongoose';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { dagligId, dagligUserName } = req.body;
    const session = await getSession({ req });
    if (!session || !session.user?.id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'no active session',
      });
    }
    const userId = session.user.id;
    if (!dagligId || !dagligUserName || !userId) {
      return res.status(400).json({
        statusCode: 400,
        message: 'missing some information to toggle favorite',
      });
    }
    await dbConnect();
    const daglig = await Daglig.findOne({ userid: { $eq: userId } });
    if (!daglig) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'daglig not found' });
    }
    const favoritesIndex = daglig.favorites.findIndex(
      (f) => f.dagligId === dagligId
    );
    if (favoritesIndex === -1) {
      daglig.favorites.push({
        _id: mongoose.Types.ObjectId(),
        dagligId,
        dagligUserName,
      });
    } else {
      daglig.favorites.splice(favoritesIndex, 1);
    }
    await daglig.save();

    res.status(201).json({ statusCode: 201 });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('method not allowed');
  }
};
