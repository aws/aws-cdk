#!/bin/bash
set -euo pipefail

mkdir -p .local-npm
(cd .local-npm && unzip ../vendor/*.zip)

echo "============================================================================================="
echo "installing repo-global dependencies..."
npm i --no-package-lock --global-style
