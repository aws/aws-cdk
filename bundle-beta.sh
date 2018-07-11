
#!/bin/bash
# Creates our beta bundle for the CDK.
# Assume we have a bootstrapped and packaged repository
set -euo pipefail
root=$PWD

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
#   aws-cdk-${version}.zip
#   ├─ bin
#   ├─ docs
#   ├─ repo
#   │  └ maven
#   ├─ y
#   │  └─ npm
#   └─ node_modules

# Creating a `y-npm` registry
echo "Preparing local NPM registry"
mkdir -p y/npm
export Y_NPM_REPOSITORY="${staging}/y/npm"
Y_NPM="${root}/tools/y-npm/bin/y-npm"
for tarball in $(find ${root}/.local-npm -iname '*.tgz') $(find ${root}/pack -iname '*.tgz'); do
    ${Y_NPM} publish ${tarball}
done

echo "Installing y-npm" # using y-npm, we're so META!
${Y_NPM} install --global-style --no-save y-npm
# Because y-npm is installed on the build server, we need to bootstrap
# it on windows by manually creating the shim batch file.
cp ${root}/tools/y-npm/bin/y-npm.template.cmd node_modules/.bin/y-npm.cmd
ln -s node_modules/.bin bin

# Create a local maven repository
echo "Preparing local MVN registry"
mkdir -p repo/maven
rsync -av ${root}/packages/aws-cdk-java/maven-repo/ repo/maven/
rsync -av ${root}/node_modules/jsii-java-runtime/maven-repo/ repo/maven/

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

