import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import { createChild } from '#utils/logger.js';
import { envConfig } from '#config/env-config.js';

const logger = createChild({ service: 'email-transport' });
const { isProd } = envConfig;

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  const config = isProd
    ? mg({
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      })
    : { host: 'mailhog', port: 1025, pool: true };

  transporter = nodemailer.createTransport(config);
  return transporter;
};

const connectEmailTransport = async () => {
  try {
    await getTransporter().verify();
    const connectionMsg = `email-transport: connected to ${isProd ? 'mailgun' : 'mailhog'}`;
    logger.info(connectionMsg);
  } catch (error) {
    const errorMsg = `email-transport error: ${error.message}`;
    logger.error(errorMsg);
  }
};

await connectEmailTransport();

export { getTransporter };
