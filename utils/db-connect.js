import mongoose from 'mongoose';

const connection = {
  isConnected: false,
};

export default async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const url = process.env.DAGLIG_MONGODB_URI;
  const db = await mongoose.connect(url, {
    w: 'majority',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
  });

  connection.isConnected = db.connections[0].readyState;
}
