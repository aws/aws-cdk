FROM public.ecr.aws/docker/library/python:3.12-slim
EXPOSE 8000
WORKDIR /src
ADD . /src
COPY --from=mycontext hello.txt /src/hello.txt
CMD ["python3", "index.py"]
