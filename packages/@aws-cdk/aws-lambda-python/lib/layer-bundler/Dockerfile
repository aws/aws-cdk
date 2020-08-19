# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG FROM=amazon/aws-sam-cli-build-image-python3.7

FROM ${FROM}

# Ensure rsync is installed
RUN yum -q list installed rsync &>/dev/null || yum install -y rsync

RUN pip install pipenv

WORKDIR /var/task.layer
COPY Pipfile* requirements.tx[t] ./
RUN [ -f 'Pipfile' ] && pipenv lock -r >requirements.txt; \
    [ -f 'requirements.txt' ] && pip install -r requirements.txt -t python;

WORKDIR /var/task.function
COPY . .

CMD [ "sh", "-c", "echo Please specify a command when running this && exit 1" ]
