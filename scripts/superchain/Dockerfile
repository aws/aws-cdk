FROM jsii/superchain:1-buster-slim-node14

# build a personalized container by setting --build-arg USER_NAME=myuser --build-arg USER_ID="$( id myuser )"
COPY ./userensure /usr/local/bin/userensure
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_NAME=user
ARG GROUP_ID=1000
ARG DOCKER_GID=999
USER root
RUN /usr/local/bin/userensure
USER ${USER_NAME}

WORKDIR /app

ARG BUILD_ARGS

ENTRYPOINT bash
CMD yarn install && yarn build ${BUILD_ARGS} 

