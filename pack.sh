#!/bin/bash
# Runs "npm package" in all modules. This will produce a "dist/" directory in each module.
# Then, calls pack-collect.sh to merge all outputs into a root ./pack directory, which is
# later read by bundle-beta.sh.
set -e
export PATH=$PWD/node_modules/.bin:$PATH
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"
root=$PWD

distdir="$PWD/dist"
rm -fr ${distdir}
mkdir -p ${distdir}

scopes=$(lerna ls 2>/dev/null | grep -v "(private)" | cut -d" " -f1 | xargs -n1 -I{} echo "--scope {}" | tr "\n" " ")

# Run the "cdk-package" script in all modules. For jsii modules, this invokes jsii-pacmak which generates and builds multi-language
# outputs. For non-jsii module, it will just run "npm pack" and place the output in dist/npm
# (which is similar to how pacmak outputs it).
lerna run ${scopes} --sort --concurrency=1 --stream package

# Collect dist/ from all modules into the root dist/
for dir in $(find packages -name dist | grep -v node_modules); do
  echo "Merging ${dir} into ${distdir}"
  rsync -av $dir/ ${distdir}/
done

# Get version from lerna
version="$(cat ${root}/lerna.json | grep version | cut -d '"' -f4)"

# Get commit from CodePipeline (or git, if we are in CodeBuild)
# If CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local
# build or CodePipeline build), use the HEAD commit hash).
commit="${CODEBUILD_RESOLVED_SOURCE_VERSION:-}"
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > ${distdir}/build.json <<HERE
{
  "name": "aws-cdk",
  "version": "${version}",
  "commit": "${commit}"
}
HERE

# copy CHANGELOG.md to dist/ for github releases
cp CHANGELOG.md ${distdir}/

# for posterity, print all files in dist
echo "=============================================================================================="
echo " dist contents"
echo "=============================================================================================="
find dist/
