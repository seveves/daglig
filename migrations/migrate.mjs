import fs from 'fs';
import mongoose from 'mongoose';

const MigrationSchmea = new mongoose.Schema({
  filename: String,
});
const Migration =
  mongoose.models.Migration || mongoose.model('Migration', MigrationSchmea);

const url = process.env.DAGLIG_MONGODB_URL;
mongoose
  .connect(url, {
    w: 'majority',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
  })
  .then((db) => {
    if (db.connections[0].readyState) {
      const files = fs.readdirSync('migrations');
      Migration.find({}, (err, docs) => {
        if (!err) {
          const migrationsAlreadyRun = docs.map((d) => `${d.filename}`);
          const migrations = files.filter(
            (file) =>
              file.indexOf('migrate') === -1 &&
              migrationsAlreadyRun.indexOf(file) === -1
          );
          if (migrations.length === 0) {
            console.log('nothing to migrate');
            return process.exit(0);
          }
          migrations.forEach((file) => {
            import(`./${file}`).then((migration) => {
              Promise.all([migration.up(), migration.down()])
                .then(() => {
                  console.log(`migrated ${file}`);
                  const migration = new Migration({ filename: file });
                  migration.save((err, doc) => {
                    if (err) {
                      console.error(
                        `error while writing migration for file ${file}`,
                        err
                      );
                    }
                    process.exit(0);
                  });
                })
                .catch((err) => {
                  console.error(`error while migrated ${file}`, err);
                  process.exit(1);
                });
            });
          });
        } else {
          console.error('migration collection error', err);
        }
      });
    } else {
      console.error('mongodb connection error', err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('mongodb connection error', err);
    process.exit(1);
  });
