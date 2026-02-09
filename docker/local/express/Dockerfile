ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-alpine

LABEL name="Billify invoicing app" \
      license="MIT" \
      description="Billify invoicing app image"

ENV NODE_ENV=development

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

RUN addgroup -S invoice && adduser -S invoice -G invoice \
    && mkdir -p ${APP_HOME}/logs && chown -R invoice:invoice ${APP_HOME}

COPY --chown=invoice:invoice package*.json ./

RUN npm ci --only=development --no-audit --no-fund --silent \
    && npm cache clean --force

COPY --chown=invoice:invoice . .

RUN chmod -R 775 ${APP_HOME}/logs

USER invoice

CMD ["npm", "run", "dev"]