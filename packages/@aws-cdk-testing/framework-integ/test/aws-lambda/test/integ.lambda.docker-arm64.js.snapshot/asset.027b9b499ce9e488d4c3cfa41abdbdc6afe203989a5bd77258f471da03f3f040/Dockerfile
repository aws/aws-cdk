FROM public.ecr.aws/lambda/python:latest

ARG FUNCTION_DIR="/var/task"
COPY index.py ${FUNCTION_DIR}

CMD [ "index.handler" ]