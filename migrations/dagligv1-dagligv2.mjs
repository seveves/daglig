import daglig from '../models/daglig.js';

const up = async () => {
  const dagligs = await daglig.DagligV1.find({});
  if (dagligs) {
    await daglig.DagligV2.insertMany(dagligs);
  }
};

const down = async () => {};

export { up, down };
