#!/bin/bash
set -euo pipefail

cd $(dirname $0)

version=$(cat ../proxyagent.version)

echo ">> Building AWS Lambda layer inside a docker image for Proxy Agent ${version}..."

TAG='aws-lambda-node-proxy-agent'

docker build -t ${TAG} . --build-arg PROXY_AGENT_VERSION=${version}

echo ">> Extrating layer.zip from the build container..."
CONTAINER=$(docker run -d ${TAG} false)
docker cp ${CONTAINER}:/layer.zip ../lib/layer.zip

echo ">> Stopping container..."
docker rm -f ${CONTAINER}
echo ">> lib/layer.zip is ready"
