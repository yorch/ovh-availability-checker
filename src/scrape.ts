import jsonfile from 'jsonfile';
import { scrapeServers } from './scrape/servers.js';

(async () => {
  const { servers, status } = await scrapeServers();
  console.log(`Status Code: ${status}`);
  console.log('Servers: ', JSON.stringify(servers, null, 2));
  console.log(`Obtained ${servers.length} servers`);

  await jsonfile.writeFile('kimsufi.json', servers);
})();
