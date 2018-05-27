FROM node:slim AS builder
ENV APP=/var/www

RUN apt-get update

# Create app directory
RUN mkdir -p $APP
WORKDIR $APP

# Install app dependencies
COPY package.json $APP
COPY package-lock.json $APP
RUN npm install

# Bundle app source in this experiment the dist should be build
# already  as well as all node modules
COPY . $APP
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV APP1=/var/www
WORKDIR /usr/share/nginx/html
COPY --from=builder $APP1/dist .

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]


# docker build -t webui -f WebUI.Dockerfile  .
# docker run -p 2001:80 -d --name webui webui

#to inspect
# docker run -it -p 2001:80  webui /bin/bash

#for openshift

# you'll need to whitelist `dtr.microcaas.net` as an insecure registry on your laptop.
#docker login -u admin -p ASKFORPASSWORD dtr.microcaas.net
#docker build . -t dtr.microcaas.net/bahcloudplatforms/gmm-prototype-ui:dev
#docker push dtr.microcaas.net/bahcloudplatforms/gmm-prototype-ui:dev
