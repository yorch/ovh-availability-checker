require('dotenv').config();

import { logger } from './logger';
import { AvailabilityChecker } from './availability-checker';
import { sendEmail, sendPushbullet, sendSms, sendTelegram } from './actions';
import { availabilityUrl, cronSchedule } from './config';
import serversToCheck from '../servers.json';

export const init = () => {
  if (!availabilityUrl) {
    logger.info('No availabilityUrl configured, exiting');
    return;
  }

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
    availabilityChecker.run();
  }
};
