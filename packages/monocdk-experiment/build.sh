#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

constructs_version="$(node -p "require('./package.json').devDependencies.constructs")"

rm -fr dist/js

echo "collecting all modules..."
outdir=$(node gen.js)

cd ${outdir}

echo "installing dependencies for bundling..."
npm install

echo "compiling..."
tsc

echo "packaging..."
npm pack
tarball=$PWD/monocdk-experiment-*.tgz

echo "verifying package..."
cd $(mktemp -d)
npm init -y
npm install ${tarball} constructs@${constructs_version}
node -e "require('monocdk-experiment')"
unpacked=$(node -p 'path.dirname(require.resolve("monocdk-experiment/package.json"))')

# saving tarball
cd ${scriptdir}
mkdir -p dist/js
cp ${tarball} dist/js

# copying src/ so this module will also work as a local dependency (e.g. for modules under @monocdk-experiment/*).
rm -fr src
rsync -av ${unpacked}/src/ src/
