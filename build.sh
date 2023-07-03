#!/bin/bash
set -euo pipefail

bail="--bail"
runtarget="build"
run_tests="true"
check_prereqs="true"
check_compat="true"
ci="false"
scope=""
concurrency=""
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
        --ci)
          ci=true
          ;;
        -c|--concurrency)
            concurrency="$2"
            shift
            ;;
        *)
            echo "Unrecognized parameter: $1"
            exit 1
            ;;
    esac
    shift
done

export NODE_OPTIONS="--max-old-space-size=8196 --experimental-worker ${NODE_OPTIONS:-}"

# Temporary log memory for long builds (this may mess with tests that check stderr)
# export NODE_OPTIONS="-r $PWD/scripts/log-memory.js ${NODE_OPTIONS:-}"

if ! [ -x "$(command -v yarn)" ]; then
  echo "yarn is not installed. Install it from here- https://yarnpkg.com/en/docs/install."
  exit 1
fi

echo "============================================================================================="
echo "installing..."
version=$(node -p "require('./package.json').version")
# this is super weird. If you run 'npm install' twice
# and it actually performs an install, then
# node-bundle test will fail with "npm ERR! maxAge must be a number".
# This won't happen in most instances because if nothing changes then npm install
# won't perform an install.
# In the pipeline however, npm install is run once when all the versions are '0.0.0' (via ./scripts/bump-candidate.sh)
# and then `align-versions` is run which updates all the versions to
# (for example) `2.74.0-rc.0` and then npm install is run again here.
if [ "$version" != "0.0.0" ]; then
  rm -rf node_modules
fi
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

if [ "$run_tests" == "true" ]; then
    runtarget="$runtarget,test"
fi

if [[ "$concurrency" == "" ]]; then
    # Auto-limit top-level concurrency to:
    # - available CPUs - 1 to limit CPU load
    # - total memory / 4GB  (N.B: constant here may need to be tweaked, configurable with $CDKBUILD_MEM_PER_PROCESS)
    mem_per_process=${CDKBUILD_MEM_PER_PROCESS:-4_000_000_000}
    concurrency=$(node -p "Math.max(1, Math.min(require('os').cpus().length - 1, Math.round(require('os').totalmem() / $mem_per_process)))")
    echo "Concurrency: $concurrency"
fi

flags=""
if [ "$ci" == "true" ]; then
  flags="--stream --no-progress --skip-nx-cache"
  export FORCE_COLOR=false
fi

echo "============================================================================================="
echo "building..."
time npx lerna run $bail --concurrency=$concurrency $runtarget $flags || fail

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
