const { oneLine } = require('common-tags');
const cron = require('node-cron');
const got = require('got');
const { groupBy } = require('lodash');
const { pick } = require('lodash/fp');

class AvailabilityChecker {
    constructor({ actions, logger, serversToCheck, url }) {
        this.actions = actions;
        this.logger = logger;
        this.serversToCheck = Object.entries(serversToCheck).reduce(
            (acc, [key, { enable, ...rest }]) => {
                if (enable === true) {
                    return {
                        ...acc,
                        [key]: rest
                    };
                }
            },
            {}
        );
        this.url = url;

        this.logger.debug('Servers to check', this.serversToCheck);
    }

    async _obtainAvailability() {
        const start = new Date();
        this.logger.info(`Obtaining availability from ${this.url}`);
        const body = await got(this.url).json();
        this.logger.info(
            `Got response in ${(new Date() - start) / 1000} secs (length: ${
                body.length
            } chars)`
        );
        const grouped = groupBy(
            body.filter(({ hardware }) =>
                Object.keys(this.serversToCheck).includes(hardware)
            ),
            'hardware'
        );

        return grouped;
    }

    _processAvailabilityResponse(response) {
        const servers = Object.entries(this.serversToCheck);
        const getAvailability = (availabilityPerCode) =>
            (availabilityPerCode || []).map(pick(['datacenters', 'region']));
        const processAvailability = (availabilityPerCode) => {
            const availability = getAvailability(availabilityPerCode);
            const datacenters = [].concat(
                ...availability.map(({ datacenters }) => datacenters)
            );
            return {
                availability,
                availableIn: datacenters
                    .filter(
                        ({ availability }) => availability !== 'unavailable'
                    )
                    .map(({ datacenter }) => datacenter),
                datacenters
            };
        };
        return servers.map(([hardwareCode, { datacenters, ...rest }]) => ({
            ...rest,
            ...processAvailability(response[hardwareCode]),
            code: hardwareCode
        }));
    }

    _composeMessages(serversAvailable) {
        return [].concat(
            ...serversAvailable.map(
                ({ availableIn, datacenters, name, cpu, ram, disk, price }) =>
                    availableIn.map(
                        (dc) => oneLine`
                                ${name}
                                (DC: ${dc}):
                                ${cpu},
                                ${ram},
                                ${disk}
                                ==>
                                ${price}
                                (
                                    availability:
                                    ${
                                        datacenters.find(
                                            ({ datacenter }) =>
                                                datacenter === dc
                                        ).availability
                                    }
                                )
                            `
                    )
            )
        );
    }

    async run() {
        const availability = await this._obtainAvailability();
        const processedAvailability = this._processAvailabilityResponse(
            availability
        );
        const serversAvailable = processedAvailability.filter(
            ({ availableIn }) => availableIn.length > 0
        );
        if (!serversAvailable || serversAvailable.length === 0) {
            this.logger.info('No available servers');
        } else {
            const messages = this._composeMessages(serversAvailable);

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

    setupSchedule(schedule) {
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
        // this.scheduledTask.stop();
        this.scheduledTask.destroy();
        this.scheduledTask = null;
    }
}

module.exports = {
    AvailabilityChecker
};
