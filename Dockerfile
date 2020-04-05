FROM node:13-alpine

RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --immutable \
    && yarn cache clean
COPY . /app

ENV NODE_ENV production

ENV LOG_FILE=/app/logs/combined.log
ENV LOG_ERROR_FILE=/app/logs/error.log

CMD mkdir -p /app/logs && \
    touch ${LOG_FILE} && \
    touch ${LOG_ERROR_FILE} && \
    dockerize \
    -stdout ${LOG_FILE} \
    -stderr ${LOG_ERROR_FILE} \
    node src/index.js
