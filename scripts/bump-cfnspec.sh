#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

pwd=$(pwd)

${pwd}/install.sh

# cfn2ts is invoked by cfnspec when a new module is created.
# However, cfnspec module is a dependency of the cfn2ts module.
# 'Building up' cfn2ts will build both cfnspec and cfn2ts
cd tools/cfn2ts
${pwd}/scripts/buildup

# Run the cfnspec update
cd ${pwd}/packages/@aws-cdk/cfnspec
yarn update
version=$(cat cfn.version)

# Come back to root, add all files to git and commit
cd ${pwd}
git add .
git commit -a -m "feat: cloudformation spec v${version}" || true # don't fail if there are no updates
