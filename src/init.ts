import {
  sendEmail,
  sendPushbullet,
  sendSms,
  sendTelegram,
} from './actions/index.js';
import { AvailabilityChecker } from './availability-checker.js';
import { availabilityUrl, cronSchedule } from './config.js';
import { logger } from './logger.js';
import { readInputFile } from './read-input-file.js';

export const init = async () => {
  if (!availabilityUrl) {
    logger.warn('No availabilityUrl configured, exiting');
    return;
  }

  const serversToCheck = await readInputFile();

  const availabilityChecker = new AvailabilityChecker({
    actions: [sendEmail, sendPushbullet, sendSms, sendTelegram],
    logger,
    serversToCheck,
    url: availabilityUrl,
  });

  if (cronSchedule) {
    availabilityChecker.setupSchedule(cronSchedule);
  } else {
    // Run once
    await availabilityChecker.run();
  }
};
