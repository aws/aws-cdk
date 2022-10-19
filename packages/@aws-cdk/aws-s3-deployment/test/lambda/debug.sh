#!/bin/sh
# starts a debugging container for the python lambda function and tests

tag="s3-deployment-test-environment"
docker build -f Dockerfile.debug -t $tag .

echo "To iterate, run python3 ./test.py inside the container (source code is mapped into the container)."

ln -fs /opt/lambda/index.py index.py
docker run -v $PWD:/opt/awscli -v $PWD/../../lib/lambda:/opt/lambda --workdir /opt/awscli -it $tag