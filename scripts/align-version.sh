#!/bin/bash
#------------------------------------------------------------------------
# updates all package.json files to the version defined in lerna.json
# this is called when building inside our ci/cd system
#------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

# go to repo root
cd ${scriptdir}/..

files="$(find . -name package.json | grep -v node_modules | xargs)"
${scriptdir}/align-version.js ${files}

CLOUD_ASSEMBLY_PACKAGE=packages/@aws-cdk/cloud-assembly-schema
CLOUD_ASSEMBLY_VERSION_FILE=${CLOUD_ASSEMBLY_PACKAGE}/schema/cloud-assembly.version.json
pushd ${CLOUD_ASSEMBLY_PACKAGE}
yarn run align-schema-version
popd

# validation
marker=$(node -p "require('./scripts/get-version-marker')")
if find . -name package.json | grep -v node_modules | xargs grep "[^0-9]${marker}"; then
  echo "ERROR: unexpected version marker ${marker} in a package.json file"
  exit 1
fi

if grep "[^0-9]${marker}" -v ${CLOUD_ASSEMBLY_VERSION_FILE} | xargs grep "[^0-9]${marker}"; then
  echo "ERROR: unexpected version marker ${marker} in a ${CLOUD_ASSEMBLY_VERSION_FILE} file"
  exit 1
fi
