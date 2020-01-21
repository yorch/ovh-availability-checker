const nodemailer = require('nodemailer');
const {
    email: {
        enable,
        from,
        smtp: { host, port, secure, user, pass },
        subject,
        toEmail
    }
} = require('../config');

const sendEmail = async ({ content, logger }) => {
    if (enable) {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            }
        });
        try {
            const info = await transporter.sendMail({
                from: `"${from.name}" <${from.email}>`,
                to: toEmail,
                subject,
                text: content,
                html: content
            });
            const { messageId } = info;

            logger.info(`Message sent: ${messageId}`);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        } catch(err) {
            logger.error(`Could not send the email`, err);
        }
    }
};

module.exports = {
    sendEmail
};
