import { SmsSender } from 'simple-sms-sender';
import { sms } from '../config';
import { Action } from '../types';

const {
  enable,
  twilio: { accountSid, from, secret, sid },
  toNumber,
} = sms;

export const sendSms: Action = async ({ content, logger }) => {
  if (!enable) {
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
