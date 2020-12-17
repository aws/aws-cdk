#!/bin/bash
set -euo pipefail

cd $(dirname $0)

echo ">> Building kubectl AWS Lambda layer (inside a docker image)..."

TAG='aws-lambda-layer-kubectl'

docker build -t ${TAG} .

echo ">> Extrating layer.zip from the build container..."
CONTAINER=$(docker run -d ${TAG} false)
docker cp ${CONTAINER}:/layer.zip ../lib/kubectl-layer.zip

echo ">> Stopping container..."
docker rm -f ${CONTAINER}
echo ">> lib/kubectl-layer.zip is ready"
