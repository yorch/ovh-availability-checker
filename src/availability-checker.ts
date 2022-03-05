import { oneLine } from 'common-tags';
import got from 'got';
import { Dictionary, groupBy } from 'lodash';
import { pick } from 'lodash/fp';
import cron from 'node-cron';
import { Logger } from './logger';
import { Action, HardwareAvailability, ServersToCheck } from './types';

const UNAVAILABLE_STATES = ['unavailable', 'unknown'];

export class AvailabilityChecker {
  actions: Action[];
  logger: Logger;
  serversToCheck: ServersToCheck;
  url: string;
  scheduledTask?: cron.ScheduledTask;

  constructor({
    actions,
    logger,
    serversToCheck,
    url,
  }: {
    actions: Action[];
    logger: Logger;
    serversToCheck: ServersToCheck;
    url: string;
  }) {
    this.actions = actions;
    this.logger = logger;
    this.serversToCheck = Object.entries(serversToCheck).reduce(
      (acc, [key, { enable, ...rest }]) => {
        if (enable === true) {
          return {
            ...acc,
            [key]: rest,
          };
        }
        return acc;
      },
      {}
    );
    this.url = url;

    this.logger.debug('Servers to check', this.serversToCheck);
  }

  async run() {
    const availability = await this._obtainAvailability();
    const processedAvailability =
      this._processAvailabilityResponse(availability);
    const serversAvailable = processedAvailability.filter(
      ({ availableIn }) => availableIn.length > 0
    );
    if (!serversAvailable || serversAvailable.length === 0) {
      this.logger.info('No available servers');
    } else {
      const messages = serversAvailable
        .map(({ availableIn, datacenters, name, cpu, ram, disk, price }) =>
          availableIn.map((dc) =>
            this._buildMessage({ name, cpu, dc, ram, disk, price, datacenters })
          )
        )
        .flat();

      // this.logger.info(JSON.stringify(availability, null, 2));
      // this.logger.info(JSON.stringify(processed, null, 2));
      // this.logger.info(JSON.stringify(serversAvailable, null, 2));

      // TODO: Maybe consolidate multiple messages into same action (ie: same email)
      messages.forEach((message) => {
        this.logger.info(messages);
        this.actions.forEach(async (action) => {
          await action({ content: message, logger: this.logger });
        });
      });
    }
  }

  setupSchedule(schedule: string) {
    if (this.scheduledTask) {
      this.logger.error('There is already an scheduled task');
      return;
    }
    this.scheduledTask = cron.schedule(schedule, () => {
      this.run();
    });
  }

  stopSchedule() {
    if (!this.scheduledTask) {
      this.logger.error('There is no scheduled task');
      return;
    }
    this.scheduledTask.stop();
    this.scheduledTask = undefined;
  }

  async _obtainAvailability() {
    this.logger.info(`Obtaining availability from ${this.url}`);
    const start = Date.now();
    const body = await got(this.url).json<HardwareAvailability[]>();
    const timeTookSecs = (Date.now() - start) / 1000;
    this.logger.info(`Obtained ${body.length} entries in ${timeTookSecs} secs`);

    return groupBy(
      body.filter(({ hardware }) =>
        Object.keys(this.serversToCheck).includes(hardware)
      ),
      'hardware'
    );
  }

  _processAvailability(availabilityPerCode: HardwareAvailability[]) {
    const availability = (availabilityPerCode || []).map(
      pick(['datacenters', 'region'])
    );

    const datacenters = availability
      .map(({ datacenters }) => datacenters)
      .flat();

    return {
      availability,
      availableIn: datacenters
        .filter(
          ({ availability }) => !UNAVAILABLE_STATES.includes(availability)
        )
        .map(({ datacenter }) => datacenter),
      datacenters,
    };
  }

  _processAvailabilityResponse(response: Dictionary<HardwareAvailability[]>) {
    return Object.entries(this.serversToCheck).map(
      ([hardwareCode, { datacenters, ...rest }]) => ({
        ...rest,
        ...this._processAvailability(response[hardwareCode]),
        code: hardwareCode,
      })
    );
  }

  _buildMessage({
    name,
    dc,
    cpu,
    ram,
    disk,
    price,
    datacenters,
  }: Partial<ReturnType<typeof this._processAvailabilityResponse>[0]> & {
    dc: string;
  }) {
    const { availability = '' } =
      datacenters?.find(({ datacenter }) => datacenter === dc) || {};

    return `${name} (DC: ${dc}): ${cpu}, ${ram}, ${disk} ==> ${price} (availability: ${availability})`;
  }
}
