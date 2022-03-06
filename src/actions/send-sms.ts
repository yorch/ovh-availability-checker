import { SmsSender } from 'simple-sms-sender';
import { sms } from '../config';
import type { Action } from '../types';

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
    logger,
    secret,
    sid,
  });

  await smsSender.sendSms({
    body: content,
    recipients: toNumber,
  });
};
