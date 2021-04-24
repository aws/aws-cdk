FROM public.ecr.aws/lambda/python:latest

ADD . /opt/lambda

# install boto3, which is available on Lambda
RUN pip3 install -U pip pipenv

# run tests
WORKDIR /opt/lambda
RUN pipenv install --dev
RUN pipenv run python -m unittest discover

ENTRYPOINT [ "/bin/bash" ]