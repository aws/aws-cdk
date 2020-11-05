#!/bin/bash
set -euo pipefail

if [ ! -f "lerna.json" ]; then
  echo "This script should be run from the root of the CDK repository"
  exit 1
fi

pwd=$(pwd)

${pwd}/install.sh

# Running the `@aws-cdk/cfnspec` update script requires both `cfn2ts` and
# `ubergen` to be readily available. The dependency can however not be modeled
# cleanly without introducing dependency cycles... This is due to how these
# dependencies are in fact involved in the building of new construct libraries
# created upon their introduction in the CFN Specification (they incur the
# dependency, not `@aws-cdk/cfnspec` itself).
yarn lerna run build --stream     \
  --scope=@aws-cdk/cfnspec        \
  --scope=cfn2ts                  \
  --scope=ubergen                 \
  --include-dependencies

# Run the cfnspec update
cd ${pwd}/packages/@aws-cdk/cfnspec
yarn update
version=$(cat cfn.version)

# Come back to root, add all files to git and commit
cd ${pwd}
git add .
git commit -a -m "feat: cloudformation spec v${version}" || true # don't fail if there are no updates