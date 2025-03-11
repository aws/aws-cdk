# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-nodejs18.x
FROM $IMAGE

# Install yarn
RUN npm install --global yarn@1.22.5

# Install pnpm
RUN npm install --global pnpm@7.30.5

# Install bun
RUN npm install --global bun@1.1.30

# Install typescript
RUN npm install --global typescript

# Install esbuild
# (unsafe-perm because esbuild has a postinstall script)
# pin the minor version to 0.21 to prevent breaking change
ARG ESBUILD_VERSION=0.21
RUN npm install --global --unsafe-perm=true esbuild@$ESBUILD_VERSION

# Ensure all users can write to npm cache
RUN mkdir /tmp/npm-cache && \
    chmod -R 777 /tmp/npm-cache && \
    npm config --global set cache /tmp/npm-cache

# Ensure all users can write to yarn cache
RUN mkdir /tmp/yarn-cache && \
    chmod -R 777 /tmp/yarn-cache && \
    yarn config set cache-folder /tmp/yarn-cache

# Ensure all users can write to pnpm cache
RUN mkdir /tmp/pnpm-cache && \
    chmod -R 777 /tmp/pnpm-cache && \
    pnpm config --global set store-dir /tmp/pnpm-cache

# Disable npm update notifications
RUN npm config --global set update-notifier false

# create non root user and change allow execute command for non root user
RUN /sbin/useradd -u 1000 user && chmod 711 /

# Ensure all users can write to bun cache
RUN mkdir /tmp/bun-cache && \
    chmod -R 777 /tmp/bun-cache && \
    echo -e "[install.cache]\ndir = \"/tmp/bun-cache\"\ndisable = true" >> /home/user/.bunfig.toml

# Setting a non-root user to run default command, 
# This will be overridden later when the Docker container is running, using either the local OS user or props.user.
USER nobody

CMD [ "esbuild" ]
