#!/bin/bash
set -euo pipefail

cd $(dirname $0)

echo ">> Building AWS Lambda layer inside docker images..."

V1_TAG="lambda-awscli-layer"
V2_TAG="lambda-awscli-v2-layer"

docker build -t "${V1_TAG}" . -f Dockerfile
docker build -t "${V2_TAG}" . -f v2.Dockerfile

echo ">> Extrating layer zip files from the build containers..."
V1_CONTAINER=$(docker run -d ${V1_TAG} false)
V2_CONTAINER=$(docker run -d ${V2_TAG} false)
docker cp "${V1_CONTAINER}:/layer.zip" ../lib/layer.zip
docker cp "${V2_CONTAINER}:/layer_v2.zip" ../lib/layer_v2.zip

echo ">> Stopping containers..."
docker rm -f "${V1_CONTAINER}"
docker rm -f "${V2_CONTAINER}"
echo ">> lib/layer.zip & lib/layer_v2.zip is ready"
