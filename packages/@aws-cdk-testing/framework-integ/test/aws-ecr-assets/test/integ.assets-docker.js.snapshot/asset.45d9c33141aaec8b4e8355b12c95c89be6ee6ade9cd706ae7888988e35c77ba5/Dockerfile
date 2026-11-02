FROM public.ecr.aws/lambda/python:3.6
EXPOSE 8000
WORKDIR /src
ADD . /src
CMD python3 build/main/index.py
