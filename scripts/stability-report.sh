#!/bin/bash
# outputs a csv that includes a report of module stability and cfn-only status
# usage: [repo_root]$ scripts/stability-report.sh
set -euo pipefail
echo "module,stability,cfn-only"
find . -name package.json | grep -v node_modules | xargs scripts/stability.js
