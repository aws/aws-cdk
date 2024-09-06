FROM  --platform=linux/amd64 node:18-alpine3.18

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm ci

# Bundle app source
COPY . /usr/src/app

USER node

CMD [ "node", "sdk-call.js" ]
