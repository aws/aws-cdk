FROM public.ecr.aws/lambda/python:3.11

RUN pip3 install boto3

ENV QUEUE_NAME $QUEUE_NAME
ENV PYTHONUNBUFFERED=1

WORKDIR /src
ADD . /src

ENTRYPOINT [ "python3", "index.py"]
