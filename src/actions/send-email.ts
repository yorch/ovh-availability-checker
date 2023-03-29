import nodemailer from 'nodemailer';
import { email } from '../config.js';
import type { Action } from '../types.js';

const {
  enable,
  from,
  smtp: { host, port, secure, user, pass },
  subject,
  toEmail,
} = email;

export const sendEmail: Action = async ({ content, logger }) => {
  if (!enable) {
    return;
  }

  if (!host || !port || !user || !pass || !from.email || !from.name) {
    logger.warn(`Email not fully configured, can't send emails.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"${from.name}" <${from.email}>`,
      to: toEmail,
      subject,
      text: content,
      html: content,
    });
    const { messageId } = info;

    logger.info(`Email message sent: ${messageId}`);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    logger.error(error, 'Could not send the email');
  }
};
