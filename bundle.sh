#!/bin/bash
# Creates the bundle for the CDK.
# Assume we have a bootstrapped and packaged repository
set -euo pipefail
root=$PWD

# Get version from lerna
version="$(cat ${root}/lerna.json | grep version | cut -d '"' -f4)"

# Get commit from CodePipeline (or git, if we are in CodeBuild)
# If CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local
# build or CodePipeline build), use the HEAD commit hash).
commit="${CODEBUILD_RESOLVED_SOURCE_VERSION:-}"
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

full_version="${version}+${commit:0:7}"
echo "Bundling ${full_version}..."

staging="$(mktemp -d)"
cleanup() {
    # Clean-up after yourself
    echo "Cleaning up staging directory: ${staging}"
    cd ${root}
    rm -rf ${staging}
}
trap cleanup EXIT
cd ${staging}

echo "Staging: ${staging}"

# Bundle structure
# ================
#   aws-cdk-${version}+${commit}.zip
#   ├─ bin
#   ├─ node_modules
#   ├─ y
#   │  └─ npm - y-npm repository for local installs (duplicate tarballs)
#   │
#   ├─ docs   - rendered docsite
#   ├─ npm    - npm tarballs
#   ├─ dotnet - nuget packages
#   ├─ java   - maven repository
#   │
#   └─ .version

# Bootstrap our distribution with "pack/", which contains the collection of all
# dist/ directories in the repo (this is what ./pack.sh is doing). This includes
# 'docs', 'npm', 'java' and 'dotnet' and any other jsii language artifacts.
rsync -av ${root}/pack/ .

# We are keeping y-npm support only for backwards compatibility reasons and until
# we publish y-npm itself and can devise instructions on how to use the self-contained .zip.
# Integration tests also depend on this behavior for now.

y_npm_dir="${root}/tools/y-npm"
Y_NPM="${y_npm_dir}/bin/y-npm"

# Creating a `y-npm` registry
echo "Preparing local NPM registry under y/npm"
export Y_NPM_REPOSITORY="${staging}/y/npm"
mkdir -p ${Y_NPM_REPOSITORY}

# Publish all tarballs from the "npm" dist to this repo
# Yes, this means we will have duplicate tgz for now.
echo "Publishing CDK npm modules into y/npm"
for tarball in $PWD/js/*.tgz; do
    ${Y_NPM} publish ${tarball}
done

echo "Installing y-npm under node_modules"
y_npm_tarball=${y_npm_dir}/$(cd ${y_npm_dir} && npm pack) # produce a tarball
npm install --global-style --no-save ${y_npm_tarball}
# Because y-npm is installed on the build server (Linux), we need to bootstrap
# it on windows by manually creating the shim batch file.
cp ${y_npm_dir}/bin/y-npm.template.cmd node_modules/.bin/y-npm.cmd
ln -s node_modules/.bin bin

# Create an archive under ./dist
echo "Creating ZIP bundle"

echo ${version} > .version
dist=${root}/dist
output="${dist}/aws-cdk-${full_version}.zip"
rm -fr ${dist}
mkdir -p ${dist}
zip -y -r ${output} .
echo ${output}

chmod +x $root/scripts/with-signing-key.sh
chmod +x $root/scripts/sign-files.sh

# Sign the bundle
$root/scripts/with-signing-key.sh $root/scripts/sign-files.sh $output
