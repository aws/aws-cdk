FROM node:8.15-alpine

WORKDIR /app

RUN apk add --update \
    bash \
    git \
    rsync \
    zip \
    python3 \
    python3-dev \
    py3-setuptools \
 && rm -rf /var/cache/apk/*

COPY . .

RUN ./build.sh \
 && ./link-all.sh

ENTRYPOINT ["/app/node_modules/.bin/cdk"]
