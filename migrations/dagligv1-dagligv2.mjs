import daglig from '../models/daglig.js';

const up = async () => {
  try {
    if (daglig && daglig.DagligV1 && daglig.DagligV2) {
      const dagligs = await daglig.DagligV1.find({});
      if (dagligs) {
        await daglig.DagligV2.insertMany(dagligs);
      }
    }
  } catch (err) {
    console.log('error while migrating dagligv1 to dagligv2', err);
  }
};

const down = async () => {};

export { up, down };
