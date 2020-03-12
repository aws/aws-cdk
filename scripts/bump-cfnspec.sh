#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

./install.sh
./build.sh
cd packages/@aws-cdk/cfnspec
yarn update
git commit -a -m "feat: cloudformation spec v$(cat cfn.version)" || true # don't fail if there are no updates
