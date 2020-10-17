#!/bin/bash
set -euo pipefail

export PATH=$(npm bin):$PATH
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

echo "============================================================================================="
echo "installing..."
yarn install --frozen-lockfile --network-timeout 1000000

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

echo "============================================================================================="
echo "building required build tools..."
time lerna run --stream build --scope cfn2ts --scope ubergen --include-dependencies || fail

echo "============================================================================================="
echo "executing gen..."
time lerna run --stream gen || fail