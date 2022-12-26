import got from 'got';
import type { Dictionary } from 'lodash';
import { groupBy } from 'lodash';
import { pick } from 'lodash/fp';
import * as cron from 'node-cron';
import type { Logger } from './logger';
import type {
  Action,
  HardwareAvailability,
  ServerAvailable,
  ServersAvailable,
  ServersToCheck,
} from './types';

const unavailableStates = new Set(['unavailable', 'unknown']);

export class AvailabilityChecker {
  actions: Action[];
  logger: Logger;
  serversToCheck: ServersToCheck;
  url: string;
  scheduledTask: cron.ScheduledTask | undefined;

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
    this.serversToCheck = Object.fromEntries(
      Object.entries(serversToCheck).filter(([, { enable }]) => enable)
    );
    this.url = url;

    this.logger.debug('Servers to check', this.serversToCheck);
  }

  async run() {
    const availability = await this._obtainAvailability();
    const serversAvailable = this._processAvailabilityResponse(
      availability
    ).filter(({ availableIn }) => availableIn.length > 0);

    if (!serversAvailable || serversAvailable.length === 0) {
      this.logger.info('No available servers');
    } else {
      const messages = this._buildMessages(serversAvailable);

      // This.logger.info(JSON.stringify(availability, null, 2));
      // this.logger.info(JSON.stringify(serversAvailable, null, 2));

      await this._runActions(messages);
    }
  }

  setupSchedule(schedule: string) {
    if (this.scheduledTask) {
      this.logger.error(
        'There is already an scheduled task, not scheduling a new one'
      );
      return;
    }

    this.scheduledTask = cron.schedule(schedule, async () => {
      await this.run();
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

  private async _runActions(messages: string[]) {
    try {
      // TODO: Consolidate multiple messages into same action (ie: same email)
      // TODO: Limit concurrency (ie: p-limit)
      await Promise.all(
        messages.flatMap((message) => {
          this.logger.info(`Processing message: ${message}`);
          return this.actions.map(this._buildRunAction(message));
        })
      );
    } catch (error) {
      this.logger.error('There was an error executing actions', error);
    }
  }

  private _buildRunAction(message: string) {
    return async (action: Action) => {
      try {
        await action({ content: message, logger: this.logger });
      } catch (error) {
        // TODO: Add more info about current action
        this.logger.error(
          `There was an error executing action ${action.name}`,
          error
        );
      }
    };
  }

  private async _obtainAvailability() {
    this.logger.info(`Obtaining availability from ${this.url}`);
    const start = Date.now();
    const response = await got(this.url).json<HardwareAvailability[]>();
    const timeTookSecs = (Date.now() - start) / 1000;
    this.logger.info(
      `Obtained ${response.length} entries in ${timeTookSecs} secs`
    );

    return groupBy(
      response.filter(({ hardware }) =>
        Object.keys(this.serversToCheck).includes(hardware)
      ),
      'hardware'
    );
  }

  private _processAvailabilityResponse(
    response: Dictionary<HardwareAvailability[]>
  ): ServersAvailable {
    return Object.entries(this.serversToCheck).map(
      ([hardwareCode, { datacenters, ...rest }]) => ({
        ...rest,
        ...this._processAvailability(response[hardwareCode]),
        code: hardwareCode,
      })
    );
  }

  private _processAvailability(availabilityPerCode?: HardwareAvailability[]) {
    const availability = (availabilityPerCode ?? []).map(
      pick(['datacenters', 'region'])
    );

    const datacentersAvailability = availability.flatMap(
      ({ datacenters }) => datacenters
    );

    return {
      availability,
      availableIn: datacentersAvailability
        .filter(({ availability }) => !unavailableStates.has(availability))
        .map(({ datacenter }) => datacenter),
      datacentersAvailability,
    };
  }

  private _buildMessages(serversAvailable: ServersAvailable) {
    return serversAvailable.flatMap(
      ({ availableIn, datacentersAvailability, name, cpu, ram, disk, price }) =>
        availableIn.map((dc) =>
          this._buildMessage({
            name,
            cpu,
            dc,
            ram,
            disk,
            price,
            datacentersAvailability,
          })
        )
    );
  }

  private _buildMessage({
    name = '',
    dc = '',
    cpu = '',
    ram = '',
    disk = '',
    price = '',
    datacentersAvailability,
  }: Partial<ServerAvailable> & {
    dc: string;
  }) {
    const { availability = '' } =
      datacentersAvailability?.find(({ datacenter }) => datacenter === dc) ??
      {};

    return `${name} (DC: ${dc}): ${cpu}, ${ram}, ${disk} ==> ${price} (availability: ${availability})`;
  }
}
