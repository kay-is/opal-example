FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8888
CMD ["npm", "run", "start"]