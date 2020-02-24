#!/bin/bash
#------------------------------------------------------------------------
# updates all package.json files to the version defined in lerna.json
# this is called when building inside our ci/cd system
#------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

# go to repo root
cd ${scriptdir}/..

# extract version from the root package.json which is the source of truth
version="$(node -p "require('./package.json').version")"

# align all package.json files
npx lerna version ${version} --yes --exact --force-publish=* --no-git-tag-version --no-push

# align all peer-deps based on deps
find . -name package.json | grep -v node_modules | xargs node ${scriptdir}/sync-peer-deps.js

# validation
if find . -name package.json | grep -v node_modules | xargs grep "999.0.0"; then
  echo "ERROR: unexpected version marker 999.0.0 in a package.json file"
  exit 1
fi