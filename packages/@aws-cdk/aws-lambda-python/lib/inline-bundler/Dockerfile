ARG FROM

FROM ${FROM}

RUN pip install pipenv

WORKDIR /var/task.function
# Copy the dependencies in first so that this intermediate layer can be cached
COPY Pipfile* requirements.tx[t] ./
RUN [ -f 'Pipfile' ] && pipenv lock -r >requirements.txt; \
    [ -f 'requirements.txt' ] && pip install -r requirements.txt -t .;
# Then copy in the rest
COPY . .

CMD [ "sh", "-c", "cp -r /var/task.function/. /asset-output/" ]
