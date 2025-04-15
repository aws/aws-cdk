#!/bin/bash
#---------------------------------------------------------------------------------------------------
# executes large file tests
#
# prepares a staging directory with the requirements
set -e
scriptdir=$(cd $(dirname $0) && pwd)

rm -f ${scriptdir}/index.py
rm -fr ${scriptdir}/__pycache__

# prepare staging directory
staging=$(mktemp -d)
mkdir -p ${staging}
cd ${staging}

# copy src and overlay with test
cp -f ${scriptdir}/../../../lib/aws-s3-deployment/bucket-deployment-handler/* $PWD
cp -f ${scriptdir}/* $PWD

# Build the Docker image with --no-cache to force rebuild
DOCKER_CMD=${CDK_DOCKER:-docker}
$DOCKER_CMD build -f Dockerfile_large --no-cache -t s3-deployment-test .

$DOCKER_CMD run --rm s3-deployment-test
