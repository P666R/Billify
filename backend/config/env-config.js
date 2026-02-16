import { cleanEnv, str, port, email, url } from 'envalid';

export const envConfig = cleanEnv(process.env, {
  // App config
  PORT: port({ default: 1997 }),
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  LOG_LEVEL: str({
    choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
    default: 'info',
  }),

  // Database
  DB_NAME: str({ default: 'billify' }),
  MONGO_ROOT_USERNAME: str({ devDefault: 'dev_user' }),
  MONGO_ROOT_PASSWORD: str({ devDefault: 'dev_password' }),
  MONGO_URI: str({ default: '' }),

  // Security (will throw if missing)
  JWT_ACCESS_SECRET_KEY: str(),
  JWT_REFRESH_SECRET_KEY: str(),

  // Email
  SENDER_EMAIL: email({ default: 'support@billify.site' }),
  DOMAIN: url({ default: 'http://localhost:8080' }),

  // Optional third-party services
  // GOOGLE_CALLBACK_URL: url({ default: undefined }),
  // GOOGLE_CLIENT_ID: str({ default: '' }),
  // GOOGLE_CLIENT_SECRET: str({ default: '' }),
  // CLOUDINARY_CLOUD_NAME: str({ default: '' }),
  // CLOUDINARY_API_KEY: str({ default: '' }),
  // CLOUDINARY_API_SECRET: str({ default: '' }),
  // MAILGUN_API_KEY: str({ default: '' }),
  // MAILGUN_DOMAIN: str({ default: '' }),
});
