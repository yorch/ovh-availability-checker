import loadJsonFile from 'load-json-file';
import { inputFile } from './config';
import type { ServersToCheck } from './types';

export const readInputFile = async () => {
  // TODO: Check if file exists
  const serversToCheck = await loadJsonFile<ServersToCheck>(inputFile);

  return serversToCheck;
};
