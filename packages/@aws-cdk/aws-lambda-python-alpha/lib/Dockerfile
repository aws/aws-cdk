# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

ARG PIP_INDEX_URL
ARG PIP_EXTRA_INDEX_URL
ARG HTTPS_PROXY
ARG POETRY_VERSION=1.5.1

# Add virtualenv path
ENV PATH="/usr/app/venv/bin:$PATH"

# set the pip cache location
ENV PIP_CACHE_DIR=/tmp/pip-cache

# set the poetry cache
ENV POETRY_CACHE_DIR=/tmp/poetry-cache

RUN \
# create a new virtualenv for python to use
# so that it isn't using root
    python -m venv /usr/app/venv && \
# Create a new location for the pip cache
    mkdir /tmp/pip-cache && \
# Ensure all users can write to pip cache
    chmod -R 777 /tmp/pip-cache && \
# Upgrade pip (required by cryptography v3.4 and above, which is a dependency of poetry)
    pip install --upgrade pip && \
# Create a new location for the poetry cache
    mkdir /tmp/poetry-cache && \
# Ensure all users can write to poetry cache
    chmod -R 777 /tmp/poetry-cache && \
# pipenv 2022.4.8 is the last version with Python 3.6 support
    pip install pipenv==2022.4.8 poetry==$POETRY_VERSION && \
# Ensure no temporary files remain in the caches
    rm -rf /tmp/pip-cache/* /tmp/poetry-cache/*

CMD [ "python" ]
