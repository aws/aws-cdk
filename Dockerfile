FROM amazonlinux:2

WORKDIR /app

ENV NODE_VERSION 10.3.0
ENV YARN_VERSION 1.19.1

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
  && gpg --list-keys 23E7166788B63E1E >/dev/null 2>&1 || (curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --import) \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
  && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && tar zvxf yarn-v$YARN_VERSION.tar.gz -C /usr/local --strip-components=1 --no-same-owner \
  && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz

COPY . .

RUN ./build.sh \
 && ./link-all.sh

ENTRYPOINT ["/app/node_modules/.bin/cdk"]
