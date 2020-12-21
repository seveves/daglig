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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.isConnected = db.connections[0].readyState === 1;
}
