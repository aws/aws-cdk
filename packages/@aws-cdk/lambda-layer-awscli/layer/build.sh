#!/bin/bash
set -euo pipefail

cd $(dirname $0)

echo ">> Building AWS Lambda layer inside a docker image..."

TAG='aws-lambda-layer'

docker build -t ${TAG} .

echo ">> Extracting layer.zip from the build container..."
CONTAINER=$(docker run -d ${TAG} false)
docker cp ${CONTAINER}:/layer.zip ../lib/layer.zip

echo ">> Stopping container..."
docker rm -f ${CONTAINER}
echo ">> lib/layer.zip is ready"
