#!/bin/bash
set -euo pipefail

bail="--bail"
runtarget="build"
run_tests="true"
check_prereqs="true"
check_compat="true"
while [[ "${1:-}" != "" ]]; do
    case $1 in
        -h|--help)
            echo "Usage: build.sh [--no-bail] [--force|-f] [--skip-test] [--skip-prereqs] [--skip-compat]"
            exit 1
            ;;
        --no-bail)
            bail="--no-bail"
            ;;
        -f|--force)
            export CDK_BUILD="--force"
            ;;
        --skip-test|--skip-tests)
            run_tests="false"
            ;;
        --skip-prereqs)
            check_prereqs="false"
            ;;
        --skip-compat)
            check_compat="false"
            ;;
        *)
            echo "Unrecognized parameter: $1"
            exit 1
            ;;
    esac
    shift
done

export PATH=$(npm bin):$PATH
export NODE_OPTIONS="--max-old-space-size=8196 --experimental-worker ${NODE_OPTIONS:-}"

if ! [ -x "$(command -v yarn)" ]; then
  echo "yarn is not installed. Install it from here- https://yarnpkg.com/en/docs/install."
  exit 1
fi

echo "============================================================================================="
echo "installing..."
yarn install --frozen-lockfile --network-timeout 1000000

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

# Check for secrets that should not be committed
/bin/bash ./git-secrets-scan.sh

# Verify all required tools are present before starting the build
if [ "$check_prereqs" == "true" ]; then
  /bin/bash ./scripts/check-build-prerequisites.sh
fi

# Check that the yarn.lock is consistent
node ./scripts/check-yarn-lock.js

# Prepare for build with references
/bin/bash scripts/generate-aggregate-tsconfig.sh > tsconfig.json

BUILD_INDICATOR=".BUILD_COMPLETED"
rm -rf $BUILD_INDICATOR

# Speed up build by reusing calculated tree hashes
# On dev machine, this speeds up the TypeScript part of the build by ~30%.
export MERKLE_BUILD_CACHE=$(mktemp -d)
trap "rm -rf $MERKLE_BUILD_CACHE" EXIT

if [ "$run_tests" == "true" ]; then
    runtarget="$runtarget+test"
fi

# Limit top-level concurrency to available CPUs - 1 to limit CPU load.
concurrency=$(node -p 'Math.max(1, require("os").cpus().length - 1)')

echo "============================================================================================="
echo "building..."
time lerna run $bail --stream --concurrency=$concurrency $runtarget || fail

if [ "$check_compat" == "true" ]; then
  /bin/bash scripts/check-api-compatibility.sh
fi

# Create the release notes for the current version. These are ephemeral and not saved in source.
# Skip this step for a "bump candidate" build, where a new, fake version number has been created
# without any corresponding changelog entries.
if ! ${BUMP_CANDIDATE:-false}; then
    node ./scripts/create-release-notes.js
fi

touch $BUILD_INDICATOR
