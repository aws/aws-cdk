#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

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
npm install ${tarball}
node -e "require('monocdk-experiment')"

# saving tarball
cd ${scriptdir}
mkdir -p dist/js
cp ${tarball} dist/js
