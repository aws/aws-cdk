#!/bin/bash
set -euo pipefail
scriptsdir=$(cd $(dirname $0) && pwd)
packagedir=$(realpath ${scriptsdir}/..)

# Input
INPUT_FILE="${packagedir}/lib/assembly-manifest.d.ts"

# Output
OUTPUT_DIR="${packagedir}/schema"
OUTPUT_FILE="${OUTPUT_DIR}/cloud-assembly.schema.json"
VERSION_FILE="${OUTPUT_DIR}/cloud-assembly.version.json"

mkdir -p ${OUTPUT_DIR}

echo "Generating JSON schema into ${OUTPUT_FILE}"
typescript-json-schema                           \
    ${INPUT_FILE}      'AssemblyManifest'        \
    --out              ${OUTPUT_FILE}            \
    --refs             true                      \
    --required         true                      \
    --strictNullChecks true                      \
    --topRef           true                      \
    --noExtraProps

# patch stack tags to match how they are actually stored in manifest.json
# the reverve path in done at runtime. see protocol.ts#patchStackTags
node ${scriptsdir}/patch-schema-stack-tags.js ${OUTPUT_FILE}

# check if the schema has changed from previous versions.
# if so, bump the major version to communicate incompatibility.
node ${scriptsdir}/bump-assembly-version.js ${VERSION_FILE}


# fetch latest tarball from npm
# tempdir=$(mktemp -d)
# pushd ${tempdir}
# npm pack @aws-cdk/cloud-assembly-schema
# tar -zxvf $(ls -l -1)
# popd

# diff=$(git diff HEAD:packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json ${tempdir}/pacakge/schema/cloud-assembly.schema.json)
# if [ ! -z ${diff} ]; then
#   # the schema has changed, lets bump the version

# fi
