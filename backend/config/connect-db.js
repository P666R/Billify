import mongoose from 'mongoose';
import { systemLogs } from '../utils/logger.js';

export const connectionToDB = async () => {
  const logger = systemLogs.child({ service: 'database' });
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams,
    );
    const connectionMsg = `database: connected to ${connect.connection.host}`;
    logger.info(connectionMsg);
  } catch (error) {
    const errorMsg = `database error: ${error.message}`;
    logger.error(errorMsg);
    process.exit(1);
  }
};
