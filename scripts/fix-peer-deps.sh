#!/bin/bash
set -euo pipefail

if [ ! -f lerna.json ]; then
  echo "This script should be run from the root of the repo."
  exit 1
fi

# first, we need to make sure that all existing peer dependencies are aligned to the "dependency" version
find . -name package.json | grep -v node_modules | xargs node scripts/sync-peer-deps.js

# must build first so .jsii is aligned
/bin/bash ./build.sh --skip-tests

# now, run jsii-fix-peers to add all missing peers based on the jsii spec
npx lerna exec "$PWD/tools/cdk-build-tools/node_modules/.bin/jsii-fix-peers 2>/dev/null || true"
