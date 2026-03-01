import mongoose from 'mongoose';
import { envConfig } from './env-config.js';
import { createChild } from '../utils/logger.js';

export const connectionToDB = async () => {
  const logger = createChild({ service: 'database' });
  try {
    const connectionParams = {
      dbName: envConfig.DB_NAME,
    };
    const connect = await mongoose.connect(
      envConfig.MONGO_URI,
      connectionParams
    );
    const connectionMsg = `database: initialized [env: ${envConfig.NODE_ENV}, host: ${connect.connection.host}]`;
    logger.info(connectionMsg);
  } catch (error) {
    const errorMsg = `database error: ${error.message}`;
    logger.error(errorMsg);
    process.exit(1);
  }
};
