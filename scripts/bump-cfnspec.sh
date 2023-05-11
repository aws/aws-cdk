#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

pwd=$(pwd)

${pwd}/install.sh

# Running the `aws-cdk-lib/scripts/gen.ts` script requires `cfn2ts`
# However we don't want to do a full build of `aws-cdk-lib``.
# So we request `@aws-cdk/cfn2ts` explicitly.
yarn lerna run build --stream     \
  --scope=@aws-cdk/cfnspec        \
  --scope=@aws-cdk/cfn2ts         \
  --include-dependencies

# Run the cfnspec update
cd ${pwd}/packages/@aws-cdk/cfnspec
yarn update
version=$(cat cfn.version)

# Generate L1s including new submodules
cd ${pwd}/packages/aws-cdk-lib
yarn gen

# Come back to root, add all files to git and commit
cd ${pwd}
git add .
git commit -a -m "feat: cloudformation spec v${version}" || true # don't fail if there are no updates
