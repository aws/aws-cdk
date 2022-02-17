# base lambda image
FROM public.ecr.aws/lambda/nodejs:latest

USER root
RUN mkdir -p /opt
WORKDIR /tmp

#
# tools
#

RUN yum update -y \
    && yum install -y zip

#
# install nodejs dependencies: proxy-agent
#

RUN mkdir -p /opt/nodejs
COPY package*.json /opt/nodejs/
RUN cd /opt/nodejs && npm ci && rm package*.json

#
# create the bundle
#

RUN cd /opt \
    && zip --symlinks -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
