import mongoose from 'mongoose';
import log from '$helpers/log';
import config from '$config';

const logger = log('Mogno connect');
export default function createMongoConnection() {
  logger.info('Connecting to mongo DB...');
  return new Promise((resolve, reject) => {
    mongoose.connect(config.MONGO.URI, {});

    mongoose.connection.on('connected', function () {
      logger.info('Mongoose connected');
      return resolve(true);
    });

    mongoose.connection.on('error', function (err) {
      logger.error('Cannot connect to mongodb');
      return reject(err);
    });

    mongoose.connection.on('disconnected', function () {
      logger.error('Mongoose disconnected');
    });
  });
}
