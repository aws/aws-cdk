#!/bin/bash
#------------------------------------------------------------------------
# updates all package.json files to the version defined in lerna.json
# this is called when building inside our ci/cd system
#------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

# go to repo root
cd ${scriptdir}/..

files="lerna.json $(find . -name package.json | grep -v node_modules | grep -v "^./package.json" | xargs)"
${scriptdir}/align-version.js ${files}

# validation
if find . -name package.json | grep -v node_modules | xargs grep "999.0.0"; then
  echo "ERROR: unexpected version marker 999.0.0 in a package.json file"
  exit 1
fi