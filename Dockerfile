FROM node:lts-alpine

WORKDIR /app

COPY package*.json app.js ./
RUN npm install

CMD ["node", "app.js"]