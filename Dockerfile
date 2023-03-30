FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn                              ./.yarn

RUN yarn install --immutable

COPY . .

RUN yarn build

RUN yarn prod-install out
RUN mv build out/build

RUN rm -rf prod/.yarn/

############################################################
# Final Image
############################################################
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/out   .

ENV NODE_ENV production
ENV LOG_FILES_ENABLE false

CMD [ "node", "build/index.js" ]
