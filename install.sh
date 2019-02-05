#!/bin/bash
set -euo pipefail

export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"


echo "============================================================================================="
echo "installing repo-global dependencies..."
npm i --no-package-lock --global-style

# Now that we have lerna available...
export PATH=node_modules/.bin:$PATH

echo "============================================================================================="
echo "bootstrapping..."
lerna bootstrap --reject-cycles --ci
