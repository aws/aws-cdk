FROM python:3.6

RUN pip3 install boto3

ENV QUEUE_NAME $QUEUE_NAME

WORKDIR /src
ADD . /src

CMD python3 index.py
