#!/bin/bash

# Pre-requisites:
# - aws-cdk-lib is built and has the "wrapper" code
# - @aws-cdk/lambda-layer-awscli is built

STARTING_DIR=$(pwd)
echo $STARTING_DIR

REPO_ROOT=$(cd $(dirname $0) && pwd)/../

echo $REPO_ROOT

# authenticate with code artifact repo
aws codeartifact login --tool npm --repository lambda-layer-separate-packages --domain mkusters

cd $REPO_ROOT/packages/@aws-cdk/lambda-layer-awscli
# yarn build
# yarn package
# upload to code artifacte repo
# npm publish ./dist/js/lambda-layer-awscli\@0.0.0.jsii.tgz

# build aws-cdk-lib with the "wrapper"
cd $REPO_ROOT/packages/aws-cdk-lib/
yarn build


