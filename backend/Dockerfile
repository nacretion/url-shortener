FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci

COPY . .

RUN npm run build

CMD [ "node", "dist/src/main" ]
