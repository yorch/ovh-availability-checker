// import * as env from 'env-var';
import { from, logger } from 'env-var';
// import { from } from 'env-var';
// import { logger } from './logger';

const env = from(process.env, {}, logger);

export const availabilityUrl = env
  .get('AVAILABILITY_URL')
  .required()
  .asString();

export const cronSchedule = env.get('CRON_SCHEDULE').required().asString();

export const logsDirectory = env.get('LOGS_DIR').default('./logs').asString();

export const email = {
  enable: env.get('EMAIL_ENABLE').default('false').asBool(),
  smtp: {
    host: env.get('SMTP_HOST').asString(),
    port: env.get('SMTP_PORT').asInt(),
    // true for 465, false for other ports
    secure: env.get('SMTP_IS_SECURE').asBool(),
    user: env.get('SMTP_USER').asString(),
    pass: env.get('SMTP_PASS').asString(),
  },
  from: {
    email: env.get('EMAIL_FROM_ADDRESS').asString(),
    name: env.get('EMAIL_FROM_NAME').asString(),
  },
  subject: env.get('EMAIL_SUBJECT').asString(),
  // Can have multiple emails separated by comma
  toEmail: env.get('EMAIL_TO_ADDRESS').asArray(),
};

export const sms = {
  enable: env.get('SMS_ENABLE').default('false').asBool(),
  toNumber: env.get('SMS_TO_NUMBER').asArray(),
  twilio: {
    accountSid: env.get('TWILIO_ACCOUNT_SID').asString(),
    from: env.get('TWILIO_FROM').asString(),
    messagingServiceSid: env.get('TWILIO_MESSAGING_SERVICE_SID').asString(),
    secret: env.get('TWILIO_SECRET').asString(),
    sid: env.get('TWILIO_SID').asString(),
  },
};

export const pushbullet = {
  enable: env.get('PUSHBULLET_ENABLE').default('false').asBool(),
  apiToken: env.get('PUSHBULLET_API_TOKEN').default('').asString(),
  deviceId: env.get('PUSHBULLET_DEVICE_ID').default('').asString(),
  noteTitle: env.get('PUSHBULLET_NODE_TITLE').default('').asString(),
};

export const telegram = {
  enable: env.get('TELEGRAM_ENABLE').default('false').asBool(),
  botToken: env.get('TELEGRAM_BOT_TOKEN'),
  chatId: env.get('TELEGRAM_CHAT_ID'),
};
