#!/bin/bash
set -euo pipefail

export NODE_OPTIONS="--max-old-space-size=8196 ${NODE_OPTIONS:-}"

echo "============================================================================================="
echo "installing..."
yarn install --frozen-lockfile --network-timeout 1000000

fail() {
  echo "❌  Last command failed. Scroll up to see errors in log (search for '!!!!!!!!')."
  exit 1
}

echo "============================================================================================="
echo "building required build tools..."
time npx lerna run --stream build --scope @aws-cdk/spec2cdk --include-dependencies || fail

echo "============================================================================================="
echo "executing gen..."
time npx lerna run --stream gen || fail
