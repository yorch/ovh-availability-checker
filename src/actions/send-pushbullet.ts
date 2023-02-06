/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { pushbullet } from '../config';
import type { Action } from '../types';

const { apiToken, enable, deviceId, noteTitle } = pushbullet;

export const sendPushbullet: Action = async ({ content, logger }) => {
  if (!enable) {
    return;
  }

  // @ts-expect-error - Typing missing
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const PushBullet = await import('pushbullet');

  if (!apiToken || !deviceId || !noteTitle) {
    logger.warn(`Pushbullet not configured correctly, can't send messages`);
    return;
  }

  try {
    const pusher = new PushBullet(apiToken);
    const response = await pusher.note(deviceId, noteTitle, content);
    logger.info(`Pushbullet sent!`);
    logger.debug(`Pushbullet: ${String(response || '')}`);
  } catch (error) {
    logger.error(error, 'Could not send pushbullet');
  }
};
