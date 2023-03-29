// eslint-disable node/prefer-global/process
import { init } from './init.js';
import { logger } from './logger.js';

process.on('SIGTERM', () => {
  logger.info('Got a SIGTERM, exiting');
  process.exit(1);
});

// eslint-disable-next-line unicorn/prefer-top-level-await
init().catch((error) => {
  logger.error(error, 'There was an unexpected error executing the program');
});
