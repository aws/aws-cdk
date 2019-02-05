#!/bin/bash
set -euo pipefail

export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

if ! npm ci --help; then
  echo "upgrading npm, because "npm ci" is not supported"
  npm i -g npm
fi

echo "============================================================================================="
echo "installing repo-global dependencies..."
npm ci --global-style

# Now that we have lerna available...
export PATH=node_modules/.bin:$PATH

echo "============================================================================================="
echo "bootstrapping..."
lerna bootstrap --reject-cycles --ci
