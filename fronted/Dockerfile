FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm config set strict-ssl false && npm config set registry http://registry.npmjs.org/ && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
