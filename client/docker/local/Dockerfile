ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-alpine

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY package*.json ./

RUN npm install

COPY . ${APP_HOME}

CMD [ "npm", "run", "dev" ]