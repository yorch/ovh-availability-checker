// @ts-expect-error
import PushBullet from 'pushbullet';
import { pushbullet } from '../config';
import { Action } from '../types';

const { apiToken, enable, deviceId, noteTitle } = pushbullet;

export const sendPushbullet: Action = async ({ content, logger }) => {
  if (!enable) {
    return;
  }

  if (!apiToken || !deviceId || !noteTitle) {
    logger.warn(`Pushbullet not configured correctly, can't send messages`);
    return;
  }

  try {
    const pusher = new PushBullet(apiToken);
    const response = await pusher.note(deviceId, noteTitle, content);
    logger.info(`Pushbullet sent!`);
    logger.debug(`Pushbullet: ${response}`);
  } catch (err) {
    logger.error(`Could not send pushbullet`, err);
  }
};
