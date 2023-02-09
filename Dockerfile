FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY ./*.ts ./
COPY ./.env ./
COPY ./tsconfig.json ./
COPY ./commands ./commands

ENV PORT 3000

EXPOSE $PORT

CMD ["npm","start"]