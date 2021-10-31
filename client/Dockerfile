FROM node:latest
WORKDIR /home/app

COPY ../server/package.json /home/app/
COPY ../server/package-lock.json /home/app/

RUN npm ci

COPY ../server /home/app

CMD node server.js
