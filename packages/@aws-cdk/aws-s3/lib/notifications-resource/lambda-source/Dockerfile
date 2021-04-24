FROM public.ecr.aws/lambda/python:latest

ADD . /opt/lambda

WORKDIR /opt/lambda
# install required deps
RUN pip3 install -U pip pipenv
RUN pipenv install --dev
# run tests
RUN pipenv run python -m unittest discover

ENTRYPOINT [ "/bin/bash" ]