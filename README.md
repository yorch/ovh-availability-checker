# OVH Availability Checker

[![Build Status](https://travis-ci.org/yorch/ovh-availability-checker.svg?branch=master)](https://travis-ci.org/yorch/ovh-availability-checker)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=yorch/ovh-availability-checker)](https://dependabot.com)
[![](https://images.microbadger.com/badges/image/yorch/ovh-availability-checker.svg)](https://microbadger.com/images/yorch/ovh-availability-checker)
[![](https://images.microbadger.com/badges/version/yorch/ovh-availability-checker.svg)](https://microbadger.com/images/yorch/ovh-availability-checker)

This is a NodeJS application that checks for the availability of OVH / Kimsufi / SoYouStart servers (according to `servers.json` config file) and if they are in stock, it can trigger:

-   An email through a configured SMTP server.
-   An SMS message through Twilio.
-   A PushBullet notification.

## Configuration

All the configuration can be made through two files:

-   `.env` -> Where all the credentials and other config are stored (ie: SMTP, Twilio API, Pushbullet, etc). Create your own `.env` file from `.env.sample`.
-   `servers.json` -> Where you can add the OVH / Kimsufi / SoYouStart servers you want to monitor.

## Run with NodeJS

```bash
# Install all dependencies:
yarn install
# or just:
yarn
# Run application
yarn start
```

## Run with Docker

The following command will build the Docker image, based on a NodeJS Alpine image, so should have a fairly small footprint, and spin it up in the background:

```bash
docker-compose up -d
```

You can easily use it out of the box and run it in a headless server like a cheap VPS using Docker. It will run in the background, even after you have logged out of the server.

## License

MIT License

Copyright (c) 2020 Jorge Barnaby

See [LICENSE](LICENSE)
