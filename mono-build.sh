#!/bin/bash
set -euo pipefail

bail="--bail"
build_monolith="false"

while [[ "${1:-}" != "" ]]; do
    case $1 in
        -h|--help)
            echo "Usage: mono-build.sh [--no-bail] [--force|-f]"
            exit 1
            ;;
        --no-bail)
            bail="--no-bail"
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

export PATH=$(npm bin):$PATH
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

if ! [ -x "$(command -v yarn)" ]; then
  echo "yarn is not installed. Install it from here- https://yarnpkg.com/en/docs/install."
  exit 1
fi

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

echo "============================================================================================="
echo "executing gen..."
time ./scripts/gen.sh || fail

echo "============================================================================================="
echo "building monolithic packages..."
time lerna --scope 'monocdk' --scope 'aws-cdk-lib' --scope '@monocdk-experiment/*' run $bail build --stream -- --skip-gen || fail
