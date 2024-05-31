FROM node:14
MAINTAINER yqq

ENV TZ Asia/Shanghai
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate

RUN mkdir -p /data/minitest/
WORKDIR /data/minitest/
COPY package*.json /data/minitest/

RUN npm install
COPY . /data/minitest/

RUN ls -al
CMD ["sh", "-c", "npm run start:${NODE_ENV}"]