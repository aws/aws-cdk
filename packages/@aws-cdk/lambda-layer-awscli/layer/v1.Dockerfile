FROM public.ecr.aws/lambda/provided:latest AS base

ARG AWSCLI_V1_VERSION=1.19.73
USER root
RUN set -ex; \
    yum update -y; \
    yum install -y zip unzip wget tar gzip;
WORKDIR /tmp
RUN set -ex; \
    mkdir -p /opt; \
    curl -sSL "https://s3.amazonaws.com/aws-cli/awscli-bundle-$AWSCLI_V1_VERSION.zip" -o awscli-bundle.zip; \
    unzip awscli-bundle.zip; \
    ./awscli-bundle/install -i /opt/awscli -b /opt/awscli/aws; \
    mv /opt/awscli /opt/awscli.tmp; \
    mv /opt/awscli.tmp/lib/python2.7/site-packages /opt/awscli; \
    mv /opt/awscli.tmp/bin /opt/awscli/bin; \
    mv /opt/awscli/bin/aws /opt/awscli; \
    rm -rf /opt/awscli.tmp /opt/awscli/pip* /opt/awscli/setuptools* /opt/awscli/awscli/examples; \
    cd /opt; \
    zip --symlinks -r ../layer_v1.zip *; \
    ls -alh /layer_v1.zip; \
    /opt/awscli/aws --version;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
