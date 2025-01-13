ARG NODE_VERSION=lts-alpine3.21

FROM node:${NODE_VERSION}

LABEL name="Billify-app" \
      license="MIT" \
      description="Invoicing app image"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY package*.json ./

RUN npm install

COPY . ${APP_HOME}

CMD ["npm", "run", "dev"]
