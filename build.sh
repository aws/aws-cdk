#!/bin/bash
set -euo pipefail

bail="--no-bail"
while [[ "${1:-}" != "" ]]; do
    case $1 in
        -h|--help)
            echo "Usage: build.sh [--bail|-b] [--force|-f]"
            exit 1
            ;;
        -b|--bail)
            bail="--bail"
            ;;
        -f|--force)
            export CDK_BUILD="--force"
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
time lerna run $bail --stream build || fail

echo "============================================================================================="
echo "testing..."
lerna run $bail --stream test || fail

touch $BUILD_INDICATOR
