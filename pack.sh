#!/bin/bash
# Runs "npm package" in all modules. This will produce a "dist/" directory in each module.
# Then, calls pack-collect.sh to merge all outputs into a root ./pack directory, which is
# later read by bundle-beta.sh.
set -eu
export PATH=$PWD/node_modules/.bin:$PATH
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"
root=$PWD

TMPDIR=${TMPDIR:-$(dirname $(mktemp -u))}
distdir="$PWD/dist"
rm -fr ${distdir}
mkdir -p ${distdir}

# Split out jsii and non-jsii packages. Jsii packages will be built all at once.
# Non-jsii packages will be run individually.
echo "Collecting package list..." >&2
scripts/list-packages $TMPDIR/jsii.txt $TMPDIR/nonjsii.txt

# Return lerna scopes from a package list
function lerna_scopes() {
  while [[ "${1:-}" != "" ]]; do
    echo "--scope $1 "
    shift
  done
}

echo "Packaging jsii modules" >&2

# Jsii packaging (all at once using jsii-pacmak)
jsii-pacmak \
  --verbose \
  --outdir $distdir/ \
  $(cat $TMPDIR/jsii.txt)

# Non-jsii packaging, which means running 'package' in every individual
# module and rsync'ing the result to the shared dist directory.
echo "Packaging non-jsii modules" >&2
lerna run $(lerna_scopes $(cat $TMPDIR/nonjsii.txt)) --sort --concurrency=1 --stream package

for dir in $(find packages -name dist | grep -v node_modules | grep -v run-wrappers); do
  echo "Merging ${dir} into ${distdir}"
  rsync -av $dir/ ${distdir}/
done

# Remove a JSII aggregate POM that may have snuk past
if [ -d dist/java/software/amazon/jsii ]; then
  rm -rf dist/java/software/amazon/jsii
fi

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
