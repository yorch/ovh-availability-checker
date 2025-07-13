FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn                              ./.yarn

RUN yarn install --immutable

COPY . .

RUN yarn build

# Create production installation
RUN yarn workspaces focus --all --production && \
    mkdir -p out && \
    cp package.json yarn.lock .yarnrc.yml out/ && \
    cp -r .yarn out/ && \
    cp -r node_modules out/ && \
    cp -r build out/

# Clean up development files from .yarn
RUN rm -rf out/.yarn/cache out/.yarn/install-state.gz

############################################################
# Final Image
############################################################
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/out   .

ENV NODE_ENV=production
ENV LOG_FILES_ENABLE=false

CMD [ "node", "build/index.js" ]
