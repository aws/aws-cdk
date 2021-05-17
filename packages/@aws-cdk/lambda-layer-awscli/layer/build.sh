#!/bin/bash
set -euo pipefail

cd $(dirname $0)

echo ">> Building AWS Lambda layer inside a docker image..."

TAG='aws-lambda-layer'

docker build -t ${TAG} .

echo ">> Extrating layer zip files from the build container..."
CONTAINER=$(docker run -d ${TAG} false)
docker cp ${CONTAINER}:/layer_v1.zip ../lib/layer_v1.zip
docker cp ${CONTAINER}:/layer_v2.zip ../lib/layer_v2.zip

echo ">> Stopping container..."
docker rm -f ${CONTAINER}
echo ">> lib/layer_v1.zip & lib/layer_v2.zip is ready"
