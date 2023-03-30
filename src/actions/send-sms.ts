import { SmsSender } from 'simple-sms-sender';
import { sms } from '../config.js';
import type { Action } from '../types.js';

const {
  enable,
  twilio: { accountSid, from, secret, sid },
  toNumber,
} = sms;

export const sendSms: Action = async ({ content, logger }) => {
  if (!enable) {
    return;
  }

  if (!accountSid || !from || !secret || !sid) {
    logger.warn('SMS not configured properly, no SMS can be send');
    return;
  }

  if (!toNumber) {
    logger.warn('No SMS send as no number was given');
    return;
  }

  const smsSender = new SmsSender({
    accountSid,
    fromNumber: from,
    // @ts-expect-error - Fix typing and making sure `simple-sms-sender` can work with Pino
    logger,
    secret,
    sid,
  });

  await smsSender.sendSms({
    body: content,
    recipients: toNumber,
  });
};
