FROM public.ecr.aws/lambda/python:3.6
RUN --mount=type=secret,id=myenvsecret cat /run/secrets/myenvsecret
EXPOSE 8000
WORKDIR /src
ADD . /src
CMD python3 index.py
