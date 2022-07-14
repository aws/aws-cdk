FROM public.ecr.aws/sam/build-python3.7

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

COPY requirements.txt ./
RUN python -m pip install -r requirements.txt -t /opt/awscli

# organize for self-contained usage
RUN mv /opt/awscli/bin/aws /opt/awscli

# cleanup
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
