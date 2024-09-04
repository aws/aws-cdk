#!/bin/bash

set -euo pipefail

set_dependency_version() {
  local manifest_path="package.json"
  local dependency="$1"
  local version="$2"

  node -e "let fs=require('fs'), manifestPath='${manifest_path}'; let manifest=JSON.parse(fs.readFileSync(manifestPath, 'utf8')); manifest.dependencies['${dependency}']='${version}'; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));"
}

set_peer_dependency_version() {
  local manifest_path="package.json"
  local dependency="$1"
  local version="$2"

  node -e "let fs=require('fs'), manifestPath='${manifest_path}'; let manifest=JSON.parse(fs.readFileSync(manifestPath, 'utf8')); manifest.peerDependencies['${dependency}']='${version}'; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));"
}

set_dev_dependency_version() {
  local manifest_path="package.json"
  local dependency="$1"
  local version="$2"

  node -e "let fs=require('fs'), manifestPath='${manifest_path}'; let manifest=JSON.parse(fs.readFileSync(manifestPath, 'utf8')); manifest.devDependencies['${dependency}']='${version}'; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));"
}

builddir=$(mktemp -d)

cd ${builddir}

echo "Working directory: ${builddir}"

git clone https://github.com/cdklabs/cloud-assembly-schema.git -b sumughan/add-session-tags-to-schema --single-branch
git clone https://github.com/cdklabs//cdk-assets.git -b sumughan/add-session-tags-to-client-options --single-branch
git clone https://github.com/aws/aws-cdk.git --single-branch -b sumughan/session-tags

echo "Building @aws-cdk/cloud-assembly-schema"
(cd cloud-assembly-schema && yarn install && yarn compile && yarn package:js)

cloud_assembly_schema_pkg_version=$(jq -r '.version' cloud-assembly-schema/package.json)
cloud_assembly_schema_pkg="${PWD}/cloud-assembly-schema/dist/js/cloud-assembly-schema@${cloud_assembly_schema_pkg_version}.jsii.tgz"

allow_all_version_range=">=0.0.0"

cp ${cloud_assembly_schema_pkg} aws-cdk/packages/@aws-cdk/cx-api/cloud-assembly-schema.tgz
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/@aws-cdk/integ-runner/cloud-assembly-schema.tgz
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/aws-cdk/cloud-assembly-schema.tgz
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/aws-cdk-lib/cloud-assembly-schema.tgz

(cd aws-cdk/packages/@aws-cdk/cx-api && set_peer_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/cx-api && set_dev_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/integ-runner && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")

echo "Building @aws-cdk/cx-api"
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/@aws-cdk/cx-api/cloud-assembly-schema.tgz
(cd aws-cdk/packages/@aws-cdk/cx-api && set_peer_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/cx-api && set_dev_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/cx-api && yarn install)
(cd aws-cdk/packages/@aws-cdk/cx-api && set_peer_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/@aws-cdk/cx-api && set_dev_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/@aws-cdk/cx-api && npx lerna run build --scope=@aws-cdk/cx-api)
(cd aws-cdk/packages/@aws-cdk/cx-api && npx cdk-package --targets js)

cx_api_pkg_version=$(jq -r '.version' aws-cdk/packages/@aws-cdk/cx-api/package.json)
cx_api_pkg="${PWD}/aws-cdk/packages/@aws-cdk/cx-api/dist/js/cx-api@${cx_api_pkg_version}.jsii.tgz"

echo "Building cdk-assets"
cp ${cloud_assembly_schema_pkg} cdk-assets/cloud-assembly-schema.tgz
cp ${cx_api_pkg} cdk-assets/cx-api.tgz
(cd cdk-assets && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd cdk-assets && set_dependency_version "@aws-cdk/cx-api" "./cx-api.tgz")
(cd cdk-assets && yarn install && yarn compile)
(cd cdk-assets && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd cdk-assets && set_dependency_version "@aws-cdk/cx-api" "${allow_all_version_range}")
(cd cdk-assets && yarn package)

cdk_assets_pkg_version=$(jq -r '.version' cdk-assets/package.json)
cdk_assets_pkg="${PWD}/cdk-assets/dist/js/cdk-assets-${cdk_assets_pkg_version}.tgz"

echo "Building aws-cdk-lib"
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/aws-cdk-lib/cloud-assembly-schema.tgz
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk-lib && yarn install)
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk-lib && npx lerna run build --scope=aws-cdk-lib)
(cd aws-cdk/packages/aws-cdk-lib && npx cdk-package --targets js)

aws_cdk_lib_pkg_version=$(jq -r '.version' aws-cdk/packages/aws-cdk-lib/package.json)
aws_cdk_lib_pkg="${PWD}/aws-cdk/packages/aws-cdk-lib/dist/js/aws-cdk-lib@${aws_cdk_lib_pkg_version}.jsii.tgz"

echo "Building aws-cdk"
cp ${cloud_assembly_schema_pkg} aws-cdk/packages/aws-cdk/cloud-assembly-schema.tgz
cp ${cdk_assets_pkg} aws-cdk/packages/aws-cdk/cdk-assets.tgz
cp ${cx_api_pkg} aws-cdk/packages/aws-cdk/cx-api.tgz

(cd aws-cdk/packages/@aws-cdk/cx-api && set_peer_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/cx-api && set_dev_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/@aws-cdk/integ-runner && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")

(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cloud-assembly-schema" "./cloud-assembly-schema.tgz")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "cdk-assets" "./cdk-assets.tgz")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cx-api" "./cx-api.tgz")
(cd aws-cdk/packages/aws-cdk && yarn install)

(cd aws-cdk/packages/@aws-cdk/cx-api && set_peer_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/@aws-cdk/cx-api && set_dev_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/@aws-cdk/integ-runner && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk-lib && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")

echo "Building @aws-cdk/cloudformation-diff"
(cd aws-cdk/packages/@aws-cdk/cloudformation-diff && npx lerna run build --scope=@aws-cdk/cloudformation-diff)

echo "Building @aws-cdk/region-info"
(cd aws-cdk/packages/@aws-cdk/region-info && npx lerna run build --scope=@aws-cdk/region-info)

(cd aws-cdk/packages/aws-cdk && yarn build --fix)
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cloud-assembly-schema" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "cdk-assets" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk && set_dependency_version "@aws-cdk/cx-api" "${allow_all_version_range}")
(cd aws-cdk/packages/aws-cdk && yarn package)

aws_cdk_pkg_version=$(jq -r '.version' aws-cdk/packages/aws-cdk/package.json)
aws_cdk_pkg="${PWD}/aws-cdk/packages/aws-cdk/dist/js/aws-cdk-${aws_cdk_pkg_version}.tgz"

echo "cloud-assembly-schema package: ${cloud_assembly_schema_pkg}"
echo "cx-api package: ${cx_api_pkg}"
echo "cdk-assets package: ${cdk_assets_pkg}"
echo "aws-cdk-lib package: ${aws_cdk_lib_pkg}"
echo "aws-cdk package: ${aws_cdk_pkg}"

workdir=$(mktemp -d)

(cd ${workdir} && mv ${cloud_assembly_schema_pkg} "cloud-assembly-schema.tgz")
(cd ${workdir} && mv ${cx_api_pkg} "cx-api.tgz")
(cd ${workdir} && mv ${cdk_assets_pkg} "cdk-assets.tgz")
(cd ${workdir} && mv ${aws_cdk_lib_pkg} "aws-cdk-lib.tgz")
(cd ${workdir} && mv ${aws_cdk_pkg} "aws-cdk.tgz")

(cd ${workdir} && npm install "./cloud-assembly-schema.tgz")
(cd ${workdir} && npm install "./cx-api.tgz")
(cd ${workdir} && npm install "./cdk-assets.tgz")
(cd ${workdir} && npm install "./aws-cdk-lib.tgz")
(cd ${workdir} && npm install "./aws-cdk.tgz")
(cd ${workdir} && touch main.ts)

echo "Done: ${workdir}"