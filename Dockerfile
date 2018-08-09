FROM node:10.8.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]
