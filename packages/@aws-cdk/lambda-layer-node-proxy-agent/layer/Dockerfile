# base lambda image
FROM public.ecr.aws/lambda/nodejs:latest

ARG PROXY_AGENT_VERSION=5.0.0

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
RUN cd /opt/nodejs && npm install proxy-agent@${PROXY_AGENT_VERSION}

#
# create the bundle
#

RUN cd /opt \
    && zip --symlinks -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
