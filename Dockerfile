FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY ./*.ts ./
COPY ./.env ./
COPY ./tsconfig.json ./
COPY ./commands ./commands
COPY ./public ./public

ENV PORT 3000

ENV NODE_ENV production

EXPOSE $PORT

CMD ["npm","start"]