FROM public.ecr.aws/lambda/python:3.6
EXPOSE 8000
WORKDIR /src
ADD . /src
COPY --from=mycontext hello.txt /src/hello.txt
CMD python3 index.py
