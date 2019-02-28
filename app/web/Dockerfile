FROM node:8.11.3
LABEL maintainer="Dave Hollander"
LABEL version="0.1"

RUN npm install npm@6.4.1 -g

WORKDIR /app/src/
COPY package.json /app/src/
RUN npm install

EXPOSE 8080 

CMD ["npm", "start"]