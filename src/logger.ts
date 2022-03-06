import path from 'node:path';
import { createLogger, format, transports } from 'winston';
import { logsDirectory, nodeEnv } from './config';

const { combine, timestamp } = format;

// TODO: Move out
// const serviceName = 'ovh-availability-checker';

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  // DefaultMeta: { service: serviceName },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({
      filename: path.join(logsDirectory, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(logsDirectory, 'combined.log'),
    }),
  ],
});

export type Logger = ReturnType<typeof createLogger>;

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (nodeEnv !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
