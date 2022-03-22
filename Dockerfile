FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

CMD ["npm", "run", "start"]

EXPOSE 6611