# base lambda image
FROM public.ecr.aws/lambda/provided:latest

# versions
ARG KUBECTL_VERSION=1.20.0
ARG HELM_VERSION=3.4.2
ARG AWSCLI_VERSION=1.18.198

USER root
RUN mkdir -p /opt
WORKDIR /tmp

# install some tools
RUN yum update -y \
    && yum install -y zip unzip make wget tar gzip

# kubectl
RUN mkdir -p /opt/kubectl
RUN cd /opt/kubectl && curl -LO "https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
RUN chmod +x /opt/kubectl/kubectl

# helm
RUN mkdir -p /tmp/helm && wget -qO- https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz | tar -xvz -C /tmp/helm
RUN mkdir -p /opt/helm && cp /tmp/helm/linux-amd64/helm /opt/helm/helm

# aws cli (latest)
RUN curl https://s3.amazonaws.com/aws-cli/awscli-bundle-${AWSCLI_VERSION}.zip -o awscli-bundle.zip
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -i /tmp/awscli -b /tmp/awscli/aws
RUN cp -r /tmp/awscli/lib/python2.7/site-packages/ /opt/awscli/ 
RUN cp -r /tmp/awscli/bin/                         /opt/awscli/bin/ 
RUN cp -r /tmp/awscli/bin/aws                      /opt/awscli/aws
RUN cp -r /usr/bin/make                            /opt/awscli/make
RUN rm -rf \
    /opt/awscli/pip* \
    /opt/awscli/setuptools* \
    /opt/awscli/awscli/examples

# jq
RUN wget https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 \
    && mv jq-linux64 /opt/awscli/jq \
    && chmod +x /opt/awscli/jq

# create the bundle
RUN cd /opt \
    && zip -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /