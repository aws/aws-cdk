FROM public.ecr.aws/lambda/provided:latest AS base

ARG AWSCLI_V2_VERSION=2.2.5
USER root
RUN set -ex; \
    yum update -y; \
    yum install -y zip unzip wget tar gzip;
WORKDIR /tmp
RUN set -ex; \
    mkdir -p /opt; \
    curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-$AWSCLI_V2_VERSION.zip" -o awscli-bundle.zip; \
    unzip awscli-bundle.zip; \
    mv ./aws/dist /opt/awscli; \
    rm -rf /opt/awscli/awscli/examples; \
    cd /opt; \
    zip --symlinks -r ../layer_v2.zip *; \
    ls -alh /layer_v2.zip; \
    /opt/awscli/aws --version;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
