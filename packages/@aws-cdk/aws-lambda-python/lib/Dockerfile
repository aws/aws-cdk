# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

ARG PIP_INDEX_URL
ARG PIP_EXTRA_INDEX_URL
ARG HTTPS_PROXY

# Create a new location for the pip cache
# Ensure all users can write to pip cache
RUN mkdir /tmp/pip-cache && \
    chmod -R 777 /tmp/pip-cache

# set the cache location
ENV PIP_CACHE_DIR=/tmp/pip-cache

# create a new virtualenv for python to use
# so that it isn't using root
RUN python -m venv /usr/app/venv
ENV PATH="/usr/app/venv/bin:$PATH"

# Upgrade pip (required by cryptography v3.4 and above, which is a dependency of poetry)
RUN pip install --upgrade pip


# pipenv 2022.4.8 is the last version with Python 3.6 support
RUN pip install pipenv==2022.4.8 poetry

# Create a new location for the poetry cache
# Ensure all users can write to poetry cache
RUN mkdir /tmp/poetry-cache && \
    chmod -R 777 /tmp/poetry-cache

# set the poetry cache
ENV POETRY_CACHE_DIR=/tmp/poetry-cache

CMD [ "python" ]
