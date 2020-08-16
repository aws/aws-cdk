ARG FROM

FROM ${FROM}

RUN pip install pipenv

WORKDIR /var/task.layer
COPY Pipfile* requirements.tx[t] ./
RUN [ -f 'Pipfile' ] && pipenv lock -r >requirements.txt; \
    [ -f 'requirements.txt' ] && pip install -r requirements.txt -t python;

WORKDIR /var/task.function
COPY . .

CMD [ "sh", "-c", "echo Please specify a command when running this && exit 1" ]
