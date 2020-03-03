#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

./install.sh
cd packages/@aws-cdk/cfnspec
../../../scripts/buildup
yarn update