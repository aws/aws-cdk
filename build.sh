#!/bin/bash
set -euo pipefail

bail="--bail"
run_tests="true"
while [[ "${1:-}" != "" ]]; do
    case $1 in
        -h|--help)
            echo "Usage: build.sh [--no-bail] [--force|-f] [--skip-test]"
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
        *)
            echo "Unrecognized parameter: $1"
            exit 1
            ;;
    esac
    shift
done

if [ ! -d node_modules ]; then
    /bin/bash ./install.sh
fi

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

/bin/bash ./git-secrets-scan.sh

# Prepare for build with references
/bin/bash scripts/generate-aggregate-tsconfig.sh > tsconfig.json

BUILD_INDICATOR=".BUILD_COMPLETED"
rm -rf $BUILD_INDICATOR

export PATH=node_modules/.bin:$PATH
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

# Speed up build by reusing calculated tree hashes
# On dev machine, this speeds up the TypeScript part of the build by ~30%.
export MERKLE_BUILD_CACHE=$(mktemp -d)
trap "rm -rf $MERKLE_BUILD_CACHE" EXIT

echo "============================================================================================="
echo "building..."
time lerna run $bail --stream build || fail

if $run_tests; then
  echo "============================================================================================="
  echo "testing..."
  lerna run $bail --stream test || fail
fi

touch $BUILD_INDICATOR
