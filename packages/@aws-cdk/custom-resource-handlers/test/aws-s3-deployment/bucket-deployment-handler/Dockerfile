FROM public.ecr.aws/lambda/python:latest

# add everything to /opt/awscli (this is where `aws` is executed from)
ADD . /opt/awscli

# install boto3, which is available on Lambda
RUN pip3 install boto3

# run tests
WORKDIR /opt/awscli
RUN ["python3", "./test.py"]

ENTRYPOINT [ "/bin/bash" ]