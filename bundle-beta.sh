
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
echo "Preparing local NPM registry"
mkdir -p repo/npm
${root}/tools/pkgtools/bin/publish-to-verdaccio \
    repo/npm                                    \
    ${root}/pack                                \
    ${root}/.local-npm

# Create a local maven repository
echo "Preparing local MVN registry"
mkdir -p repo/maven
rsync -av ${root}/packages/aws-cdk-java/maven-repo/ repo/maven/
rsync -av ${root}/node_modules/jsii-java-runtime/maven-repo/ repo/maven/

# Bootstrap a production-ready node_modules closure with all npm modules (jsii and CDK)
echo "Bootstrapping a production-ready npm closure"
npm install --global-style --production --no-save $(find repo/npm -iname '*.tgz')

# Symlink 'bin' to the root
echo "Symlinking bin"
ln -s node_modules/.bin bin

# Symlink the docs website to docs
echo "Symlinking docs"
ln -s node_modules/aws-cdk-docs/dist/docs docs

# Create an archive under ./dist
echo "Creating ZIP bundle"
version="$(cat ${root}/lerna.json | grep version | cut -d '"' -f4)"
dist=${root}/dist
output=${dist}/aws-cdk-${version}.zip
rm -fr ${dist}
mkdir -p ${dist}
zip -y -r ${output} .
echo ${output}

# Sign the bundle
/bin/bash $root/sign.sh $output

