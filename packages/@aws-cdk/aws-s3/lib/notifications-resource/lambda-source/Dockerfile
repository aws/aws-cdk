FROM public.ecr.aws/lambda/python:3.8

RUN yum install -y make

ADD . /opt/lambda

WORKDIR /opt/lambda
RUN make dev
RUN make test

ENTRYPOINT [ "/bin/bash" ]