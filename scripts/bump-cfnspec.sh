#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

pwd=$(pwd)

${pwd}/install.sh

# Running the `aws-cdk-lib/scripts/gen.ts` script requires `cfn2ts`
# However we don't want to do a full build of `aws-cdk-lib`.
# So we request an explicit install of `@aws-cdk/cfn2ts`.
yarn lerna run build --stream     \
  --skip-nx-cache                 \
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

# No need to further build or test `aws-cdk-lib` lib here.
# A Pull Request will be created which will fail if something is not working.
# We can then fixup any issue on the Pull Request itself.

# Come back to root, add all files to git and commit
cd ${pwd}
git add .
git commit -a -m "feat: cloudformation spec v${version}" || true # don't fail if there are no updates
