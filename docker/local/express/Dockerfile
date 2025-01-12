ARG NODE_VERSION=lts-alpine3.21

FROM node:${NODE_VERSION}

LABEL name="Billify-app" \
      license="MIT" \
      description="Invoicing app image"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

RUN addgroup -S invoice && adduser -S -G invoice invoice

COPY package*.json ./

RUN npm install

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown -R invoice:invoice ${APP_HOME}

USER invoice

CMD ["npm", "run", "dev"]
