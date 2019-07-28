#!/bin/bash
set -euo pipefail

export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

if ! npm ci --help; then
  echo "upgrading npm, because "npm ci" is not supported"
  npm i -g npm@~6.8.0
fi

echo "============================================================================================="
echo "installing repo-global dependencies..."
npm ci --global-style

# Now that we have lerna available...
export PATH=$(npm bin):$PATH

echo "============================================================================================="
echo "cleanup and start bootstrapping..."
lerna clean --yes
lerna bootstrap --reject-cycles --ci

echo "============================================================================================="
echo "installing local links..."
node scripts/install-local-deps.js
