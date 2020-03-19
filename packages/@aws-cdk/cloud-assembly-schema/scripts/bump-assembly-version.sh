#!/bin/bash
set -euo pipefail
scriptsdir=$(cd $(dirname $0) && pwd)

VERSION_FILE="${OUTPUT_DIR}/cloud-assembly.version.json"

# fetch latest tarball from npm
tempdir=$(mktemp -d)
pushd ${tempdir}
npm pack @aws-cdk/cloud-assembly-schema
tar -zxvf $(ls -l -1)
popd

diff=$(json-schema-diff packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json ${tempdir}/pacakge/schema/cloud-assembly.schema.json)
if [ ! -z ${diff} ]; then
  # the schema has changed, lets bump the version.
  node ${scriptsdir}/bump-assembly-version.js ${VERSION_FILE}
fi
