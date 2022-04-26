# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

ARG PIP_INDEX_URL
ARG PIP_EXTRA_INDEX_URL
ARG HTTPS_PROXY

# Upgrade pip (required by cryptography v3.4 and above, which is a dependency of poetry)
RUN pip install --upgrade pip

# pipenv 2022.4.8 is the last version with Python 3.6 support
RUN pip install pipenv==2022.4.8 poetry

CMD [ "python" ]
