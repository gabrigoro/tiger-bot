FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY ./*.ts ./
COPY ./tsconfig.json ./
COPY ./commands ./commands

ENV PORT 3000

ENV BOT_TOKEN 5616737402:AAFK1k61PFfFEtfa9rqWgry2dcou_OqDY9w
ENV API_KEY AIzaSyBNH8U3FX8KZ2Dt4ivRRp0GSL4OpMI2ON4
ENV AUTH_DOMAIN purpose-tiger.firebaseapp.com
ENV PROJECT_ID purpose-tiger
ENV STORAGE_BUCKET purpose-tiger.appspot.com
ENV MESSAGING_SENDER_ID 760962459657
ENV APP_ID 1:760962459657:web:218fc9cfa4121bd935f0d8

EXPOSE $PORT

CMD ["npm","start"]