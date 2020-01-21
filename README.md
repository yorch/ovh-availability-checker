# OVH Servers Availability Checker

This is a NodeJS application that checks for the availability of OVH / Kimsufi / SoYouStart servers (according to `servers.json` config file) and if they are available, it can trigger:
* An email through a configured SMTP server.
* An SMS message through Twilio.
* A PushBullet notification.

## Configuration

All the configuration can be made through two files:
* `.env` -> Where all the credentials and other config are stored (ie: SMTP, Twilio API, Pushbullet, etc).
* `servers.json` -> Where you can add the OVH / Kimsufi / SoYouStart servers you want to monitor.

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

```bash
docker-compose up -d
```
