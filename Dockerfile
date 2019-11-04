FROM amazonlinux:2

WORKDIR /app

ENV NODE_VERSION 10.3.0

RUN yum -y --security update \
  && yum install -y \
    git \
    rsync \
    zip \
    unzip \
    tar \
    xz \
    python3 \
    python3-dev \
    py3-setuptools \
  && yum clean all \
  && rm -rf /var/cache/yum \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt" \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt \
  && curl -fsSLO "https://yarnpkg.com/latest.tar.gz" \
  && tar zvxf latest.tar.gz -C /usr/local --strip-components=1 --no-same-owner \
  && rm latest.tar.gz

COPY . .

RUN ./build.sh \
 && ./link-all.sh

ENTRYPOINT ["/app/node_modules/.bin/cdk"]
