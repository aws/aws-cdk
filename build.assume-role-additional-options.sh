#!/bin/bash

set -euo pipefail

set_dependency_version() {
  local manifest_path="package.json"
  local dependency="$1"
  local version="$2"

  node -e "let fs=require('fs'), manifestPath='${manifest_path}'; let manifest=JSON.parse(fs.readFileSync(manifestPath, 'utf8')); manifest.dependencies['${dependency}']='${version}'; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));"
}

workdir=$(mktemp -d)

cd ${workdir}

echo "Working directory: ${workdir}"

git clone https://github.com/cdklabs/cloud-assembly-schema.git -b sumughan/add-session-tags-to-schema --single-branch
git clone https://github.com/cdklabs//cdk-assets.git -b sumughan/add-session-tags-to-client-options --single-branch
git clone https://github.com/aws/aws-cdk.git --single-branch -b sumughan/session-tags

(cd cloud-assembly-schema && yarn install && yarn bump && yarn compile && yarn package:js)

cloud_assembly_schema_pkg_version=$(jq -r '.version' cloud-assembly-schema/package.json)
cloud_assembly_schema_pkg="${PWD}/cloud-assembly-schema/dist/js/cloud-assembly-schema@${cloud_assembly_schema_pkg_version}.jsii.tgz"

cp ${cloud_assembly_schema_pkg} aws-cdk/packages/aws-cdk-lib/cloud-assembly-schema.tgz
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk-lib && yarn install)
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${cloud_assembly_schema_pkg_version}")
(cd aws-cdk/packages/aws-cdk-lib && npx lerna run build --scope=aws-cdk-lib --skip-nx-cache)

# cp ${cloud_assembly_schema_pkg} cdk-assets/cloud-assembly-schema.tgz
# (cd cdk-assets && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
# (cd cdk-assets && yarn install && yarn bump && yarn compile)
# (cd cdk-assets && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${cloud_assembly_schema_pkg_version}")
# (cd cdk-assets && yarn package)

# cdk_assets_pkg_version=$(jq -r '.version' cdk-assets/package.json)
# cdk_assets_pkg="${PWD}/cdk-assets/dist/js/cdk-assets-${cdk_assets_pkg_version}.tgz"

# echo "cloud-assembly-schema package: ${cloud_assembly_schema_pkg}"
# echo "cdk-assets package: ${cdk_assets_pkg}"

