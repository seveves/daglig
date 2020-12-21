import Daglig from '../../models/daglig';
import dbConnect from '../../utils/db-connect';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { dagligId, userId, postId } = req.body;

    if (!dagligId || !userId || !postId) {
      return res.status(400).json({
        statusCode: 400,
        message: 'missing some information to like',
      });
    }
    await dbConnect();
    const userThatLikes = await Daglig.findOne({ userid: { $eq: userId } });
    const user = await Daglig.findById(dagligId);
    if (!userThatLikes || !user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'user not found' });
    }
    const postIndex = user.posts.findIndex((p) => `${p._id}` === postId);
    if (postIndex === -1) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'post not found' });
    }
    const likeIndex = user.posts[postIndex].likes.findIndex(
      (l) => l === userId
    );
    if (likeIndex === -1) {
      user.posts[postIndex].likes.push(userId);
    } else {
      user.posts[postIndex].likes.splice(likeIndex, 1);
    }
    await user.save();

    res
      .status(201)
      .json({
        statusCode: 201,
        likes: user.posts[postIndex].likes.map((l) => `${l}`),
      });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('method not allowed');
  }
};
