
#!/bin/bash
# Creates our beta bundle for the CDK.
# Assume we have a bootstrapped and packaged repository
set -euo pipefail
root=$PWD

staging="$(mktemp -d)"
cd ${staging}

echo "Staging: ${staging}"

# Bundle structure
# ================
#
#   + bin
#   + docs
#   + repo
#      + npm
#      + maven
#   + node_modules
#

# Create a local npm repository
mkdir -p repo/npm
rsync -aL ${root}/pack/*.tgz repo/npm      # cdk modules
rsync -aL ${root}/local-npm/*.tgz repo/npm # jsii modules

# Create a local maven repository
mkdir -p repo/maven
cp ${root}/packages/aws-cdk-java/target/*.jar repo/maven

# Deploy the docs website to docs/
rsync -a ${root}/packages/aws-cdk-docs/dist/docs/ ./docs

# Bootstrap a production-ready node_modules closure with all npm modules (jsii and CDK)
npm install --global-style --production --no-save repo/npm/*.tgz

# Symlink 'bin' to the root
ln -s node_modules/.bin bin

# Create an archive under ./dist
version="$(cat ${root}/lerna.json | grep version | cut -d '"' -f4)"
dist=${root}/dist
output=${dist}/aws-cdk-${version}.zip
rm -fr ${dist}
mkdir -p ${dist}
zip -y -r ${output} .
echo ${output}
