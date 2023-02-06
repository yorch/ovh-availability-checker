FROM node:18-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
LABEL \
    maintainer="jorge.barnaby@gmail.com" \
    org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="OVH Servers Availability Checker" \
    org.label-schema.description="Check if an OVH / Kimsufi / SoYouStart server is on stock or not" \
    org.label-schema.url="https://github.com/yorch" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/yorch/ovh-availability-checker" \
    org.label-schema.vendor="Barnaby Tech" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0"

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable \
    && yarn cache clean
COPY . .

ENV NODE_ENV production
ENV LOG_FILES_ENABLE false

CMD yarn start
