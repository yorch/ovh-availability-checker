const { env } = process;

module.exports = {
    availabilityUrl: env.AVAILABILITY_URL,
    cronSchedule: env.CRON_SCHEDULE,
    logsDirectory: env.LOGS_DIR || './logs',
    email: {
        enable: env.EMAIL_ENABLE === 'true',
        smtp: {
            host: env.SMTP_HOST,
            port: Number(env.SMTP_PORT),
            // true for 465, false for other ports
            secure: env.SMTP_IS_SECURE === 'true',
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        },
        from: {
            email: env.EMAIL_FROM_ADDRESS,
            name: env.EMAIL_FROM_NAME
        },
        subject: env.EMAIL_SUBJECT,
        // Can have multiple emails separated by comma
        toEmail: env.EMAIL_TO_ADDRESS
    },
    sms: {
        enable: env.SMS_ENABLE === 'true',
        toNumber: env.SMS_TO_NUMBER,
        twilio: {
            accountSid: env.TWILIO_ACCOUNT_SID,
            from: env.TWILIO_FROM,
            messagingServiceSid: env.TWILIO_MESSAGING_SERVICE_SID,
            secret: env.TWILIO_SECRET,
            sid: env.TWILIO_SID
        }
    },
    pushbullet: {
        enable: env.PUSHBULLET_ENABLE === 'true',
        apiToken: env.PUSHBULLET_API_TOKEN,
        deviceId: env.PUSHBULLET_DEVICE_ID,
        noteTitle: env.PUSHBULLET_NODE_TITLE
    },
    telegram: {
        enable: env.TELEGRAM_ENABLE === 'true',
        botToken: env.TELEGRAM_BOT_TOKEN,
        chatId: env.TELEGRAM_CHAT_ID
    }
};
