# base lambda image
FROM public.ecr.aws/lambda/provided:latest

#
# versions
#
ARG KUBECTL_VERSION
ARG HELM_VERSION

USER root
RUN mkdir -p /opt
WORKDIR /tmp

#
# tools
#

RUN yum update -y \
    && yum install -y zip unzip wget tar gzip

#
# kubectl
#

RUN mkdir -p /asset/kubectl
RUN cd /asset/kubectl && curl -LO "https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
RUN chmod +x /asset/kubectl/kubectl

#
# helm
#

RUN mkdir -p /tmp/helm && wget -qO- https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz | tar -xvz -C /tmp/helm
RUN mkdir -p /asset/helm && cp /tmp/helm/linux-amd64/helm /asset/helm/helm

#
# create the bundle
#

RUN ls -la /asset