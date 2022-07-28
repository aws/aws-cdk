#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

pwd=$(pwd)

${pwd}/install.sh

# Build the `@aws-cdk/cfnspec` package and its dependencies
yarn lerna run build --stream     \
  --scope=@aws-cdk/cfnspec        \
  --include-dependencies

cd packages/@aws-cdk/cfnspec
yarn rejected
