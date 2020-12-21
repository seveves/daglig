import Daglig from '../../models/daglig';
import dbConnect from '../../utils/db-connect';
import mongoose from 'mongoose';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { id, message } = req.body;

    const isNull = message == null;
    const minLength = message.length === 0;
    const maxLength = message.length > 144;
    if (isNull || minLength || maxLength) {
      return res.status(400).json({
        statusCode: 400,
        message: 'message not well formatted',
        cause: {
          isNull,
          minLength,
          maxLength,
        },
      });
    }
    await dbConnect();
    const daglig = await Daglig.findById(id);
    if (!daglig) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'user not found' });
    }
    daglig.posts.push({
      _id: mongoose.Types.ObjectId(),
      message,
      likes: [],
    });
    await daglig.save();

    res.status(201).json({ statusCode: 201, message: 'created post' });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('method not allowed');
  }
};
