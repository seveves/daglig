import mongoose from 'mongoose';

const DagligSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  posts: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      message: String,
      likes: [String],
    },
  ],
});

const modelV1 = mongoose.models.DagligV1 || mongoose.model('DagligV1', DagligSchema);

export default modelV1;
