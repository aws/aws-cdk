FROM public.ecr.aws/lambda/python:3.6
RUN --mount=type=secret,id=mysecret cat /run/secrets/mysecret
EXPOSE 8000
WORKDIR /src
ADD . /src
CMD python3 index.py
