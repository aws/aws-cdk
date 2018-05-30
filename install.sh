#!/bin/bash
set -euo pipefail

echo "============================================================================================="
echo "installing repo-global dependencies..."
npm i --no-package-lock --global-style
