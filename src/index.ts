import { init } from './init';
import { logger } from './logger';

process.on('SIGTERM', () => {
  logger.info('Got a SIGTERM, exiting');
  process.exit(1);
});

init();
