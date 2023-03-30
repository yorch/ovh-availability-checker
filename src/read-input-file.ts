import loadJsonFile from 'load-json-file';
import { inputFile } from './config.js';
import type { ServersToCheck } from './types.js';

export const readInputFile = async () => {
  // TODO: Check if file exists
  const serversToCheck = await loadJsonFile<ServersToCheck>(inputFile);

  return serversToCheck;
};
