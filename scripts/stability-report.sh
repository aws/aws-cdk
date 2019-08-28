#!/bin/bash
# generates a csv that includes a report of module stability and cfn-only status
# usage: repo-root$ scripts/stability-report.sh
set -euo pipefail
outfile="stability.csv"
echo "module,stability,cfn-only" > ${outfile}
find . -name package.json | grep -v node_modules | xargs -n1 node scripts/stability.js >> ${outfile}

