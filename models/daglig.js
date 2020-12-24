const mongoose = require('mongoose');

const initialSchemaDefinition = {
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
    default: Date.now,
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
};

const DagligSchema = new mongoose.Schema(initialSchemaDefinition);
const DagligV1 =
  mongoose.models.DagligV1 || mongoose.model('DagligV1', DagligSchema);

const schemaUpdateV2 = {
  ...initialSchemaDefinition,
  favorites: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      dagligId: { type: String, required: true },
      dagligUserName: { type: String, required: true },
    },
  ],
};
const DagligSchemaV2 = new mongoose.Schema(schemaUpdateV2);
const DagligV2 =
  mongoose.models.DagligV2 || mongoose.model('DagligV2', DagligSchemaV2);

module.exports = {
  DagligV1,
  DagligV2,
  Daglig: DagligV2,
};
