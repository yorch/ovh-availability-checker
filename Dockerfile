FROM node:17-alpine

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

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV WORKDIR=/app
WORKDIR $WORKDIR

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable \
    && yarn cache clean
COPY . .

ENV NODE_ENV production

ENV LOG_FILE=${WORKDIR}/logs/combined.log
ENV LOG_ERROR_FILE=${WORKDIR}/logs/error.log

CMD mkdir -p ${WORKDIR}/logs && \
    touch ${LOG_FILE} && \
    touch ${LOG_ERROR_FILE} && \
    dockerize \
    -stdout ${LOG_FILE} \
    -stderr ${LOG_ERROR_FILE} \
    yarn start
