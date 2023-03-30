import jsonfile from 'jsonfile';
import { logger } from './logger.js';
import { scrapeServers } from './scrape/scrape-servers.js';

const filename = 'scrapped-servers.json';

const { servers, status } = await scrapeServers();

logger.info(`Status Code: ${status}`);
logger.info(`Obtained ${servers.length} servers and saved to ${filename}`);

await jsonfile.writeFile(filename, servers, { spaces: 2 });
