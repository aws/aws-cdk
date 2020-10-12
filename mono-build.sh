#!/bin/bash
set -euo pipefail

bail="--bail"
runtarget="build --no-gen"
check_prereqs="true"
check_compat="true"
build_monolith="false"

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
            runtarget="build"
            ;;
        --skip-prereqs)
            check_prereqs="false"
            ;;
        --skip-compat)
            check_compat="false"
            ;;
        --skip-mono)
            build_monolith="true"
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

echo "============================================================================================="
echo "installing..."
yarn install --frozen-lockfile --network-timeout 1000000

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

echo "============================================================================================="
echo "building required build tools..."
time lerna run $bail --stream build --scope cfn2ts --scope ubergen --include-dependencies || fail

echo "============================================================================================="
echo "executing gen..."
time lerna run $bail --stream gen || fail

echo "============================================================================================="
echo "building monolithic packages..."
time lerna --scope 'monocdk' --scope 'aws-cdk-lib' --scope '@monocdk-experiment/*' run $bail build --stream -- --skip-gen || fail
