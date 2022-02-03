FROM public.ecr.aws/lambda/provided:latest

USER root
RUN mkdir -p /opt
WORKDIR /tmp

#
# tools
#

RUN yum update -y \
    && yum install -y zip unzip wget tar gzip python3

#
# aws cli
#

ARG AWSCLI_VERSION=0.0.0

RUN curl https://s3.amazonaws.com/aws-cli/awscli-bundle-${AWSCLI_VERSION}.zip -o awscli-bundle.zip
RUN unzip awscli-bundle.zip
RUN python3 ./awscli-bundle/install -i /opt/awscli -b /opt/awscli/aws

# organize for self-contained usage
RUN mv /opt/awscli                                      /opt/awscli.tmp
RUN pyver=$(python3 -c 'import sys; v = sys.version_info; print(f"{v[0]}.{v[1]}")') && \
    mv /opt/awscli.tmp/lib/python${pyver}/site-packages /opt/awscli
RUN mv /opt/awscli.tmp/bin                              /opt/awscli/bin
RUN mv /opt/awscli/bin/aws                              /opt/awscli

# cleanup
RUN rm -fr /opt/awscli.tmp
RUN rm -rf \
    /opt/awscli/pip* \
    /opt/awscli/setuptools* \
    /opt/awscli/awscli/examples

#
# Test that the CLI works
#

RUN yum install -y groff
RUN /opt/awscli/aws help

#
# create the bundle
#

RUN cd /opt \
    && zip --symlinks -r ../layer.zip * \
    && echo "/layer.zip is ready" \
    && ls -alh /layer.zip;

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]
