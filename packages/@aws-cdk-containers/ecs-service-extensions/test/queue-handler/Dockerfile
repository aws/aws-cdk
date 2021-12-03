FROM public.ecr.aws/lambda/python:latest

ADD . /opt/lambda
WORKDIR /opt/lambda

RUN pip3 install boto3
RUN python3 test_index.py

ENTRYPOINT [ "/bin/bash" ]