import os from 'node:os';
import path from 'node:path';
import { pino, type TransportTargetOptions } from 'pino';
import {
  datasetLogger,
  isProduction,
  logFilesEnable,
  logLevel,
  logsDirectory,
} from './config.js';
import { exists } from './utils.js';

const stdOutTarget: TransportTargetOptions = {
  target: 'pino/file',
  level: logLevel,
  options: {},
};

const fileErrorTarget: TransportTargetOptions = {
  target: 'pino/file',
  level: 'error',
  options: {
    destination: path.join(logsDirectory, 'error.log'),
    mkdir: true,
  },
};

const fileTarget: TransportTargetOptions = {
  target: 'pino/file',
  level: logLevel,
  options: {
    destination: path.join(logsDirectory, 'combined.log'),
    mkdir: true,
  },
};

const pinoPrettyTarget = {
  target: 'pino-pretty',
  level: logLevel,
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    // TranslateTime: 'yyyy/mm/dd HH:MM:ss Z',
    translateTime: 'HH:MM:ss Z',
  },
};

const dataSetTarget = datasetLogger.enable
  ? {
      target: 'pino-dataset-transport',
      level: logLevel,
      options: {
        loggerOptions: {
          apiKey: datasetLogger.apiKey,
          ...(datasetLogger.serverUrl
            ? { serverUrl: datasetLogger.serverUrl }
            : {}),
          sessionInfo: {
            // TODO: Add build time, version and SHA
            serverHost: os.hostname(),
            logfile: 'app.log',
            osHomedir: os.homedir(),
            osPlatform: os.platform(),
            osRelease: os.release(),
            osType: os.type(),
            osVersion: os.version(),
            userInfo: os.userInfo(),
          },
          shouldFlattenAttributes: true,
        },
      },
    }
  : undefined;

export const logger = pino({
  transport: {
    targets: [
      // To make sure we always print to console regardless if production or not
      isProduction ? stdOutTarget : pinoPrettyTarget,
      dataSetTarget,
      ...(logFilesEnable ? [fileErrorTarget, fileTarget] : []),
    ].filter(exists), // eslint-disable-line unicorn/no-array-callback-reference
  },
  level: logLevel,
});

export const createChildLogger = (module: string) => logger.child({ module });

export type Logger = pino.Logger;
