#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    /bin/bash ./install.sh
fi

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log."
  exit 1
}

/bin/bash ./git-secrets-scan.sh

BUILD_INDICATOR=".BUILD_COMPLETED"
rm -rf $BUILD_INDICATOR

export PATH=node_modules/.bin:$PATH

# Speed up build by reusing calculated tree hashes
# On dev machine, this speeds up the TypeScript part of the build by ~30%.
export MERKLE_BUILD_CACHE=$(mktemp -d)
trap "rm -rf $MERKLE_BUILD_CACHE" EXIT

echo "============================================================================================="
echo "building..."
time lerna run --no-bail --stream build || fail

echo "============================================================================================="
echo "testing..."
lerna run --no-bail --stream test || fail

touch $BUILD_INDICATOR
