#!/bin/bash
set -euo pipefail

# render docs to docs/dist
(cd docs && bash ./build-docs.sh)

lerna ls > docs/dist/packages.txt

# deploy output to 'pack/docs'
rm -fr dist/docs
mkdir dist/docs
rsync -av docs/dist/ dist/docs/
