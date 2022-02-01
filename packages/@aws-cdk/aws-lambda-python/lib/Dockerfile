# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

ARG PIP_INDEX_URL
ARG PIP_EXTRA_INDEX_URL
ARG HTTPS_PROXY

# Upgrade pip (required by cryptography v3.4 and above, which is a dependency of poetry)
RUN pip install --upgrade pip
RUN pip install pipenv poetry

CMD [ "python" ]
