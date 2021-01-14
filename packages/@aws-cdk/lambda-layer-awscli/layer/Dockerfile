FROM public.ecr.aws/lambda/provided:latest

#
# versions
#

ARG AWSCLI_VERSION=1.18.198

USER root
RUN mkdir -p /opt
WORKDIR /tmp

#
# tools
#

RUN yum update -y \
    && yum install -y zip unzip wget tar gzip

#
# aws cli
#

RUN curl https://s3.amazonaws.com/aws-cli/awscli-bundle-${AWSCLI_VERSION}.zip -o awscli-bundle.zip
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -i /opt/awscli -b /opt/awscli/aws

# organize for self-contained usage
RUN mv /opt/awscli                                    /opt/awscli.tmp
RUN mv /opt/awscli.tmp/lib/python2.7/site-packages    /opt/awscli
RUN mv /opt/awscli.tmp/bin                            /opt/awscli/bin
RUN mv /opt/awscli/bin/aws                            /opt/awscli

# cleanup
RUN rm -fr /opt/awscli.tmp
RUN rm -rf \
    /opt/awscli/pip* \
    /opt/awscli/setuptools* \
    /opt/awscli/awscli/examples

#
# create the bundle
#

RUN cd /opt \
    && zip --symlinks -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]