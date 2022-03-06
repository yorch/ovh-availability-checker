import { sendEmail, sendPushbullet, sendSms, sendTelegram } from './actions';
import { AvailabilityChecker } from './availability-checker';
import { availabilityUrl, cronSchedule } from './config';
import { logger } from './logger';
import { readInputFile } from './read-input-file';

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
