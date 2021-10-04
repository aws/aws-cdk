FROM public.ecr.aws/lambda/python:latest-arm64

ARG FUNCTION_DIR="/var/task"
COPY index.py ${FUNCTION_DIR}

CMD [ "index.handler" ]