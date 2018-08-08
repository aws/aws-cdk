#!/bin/bash
set -euo pipefail

# render docs to docs/dist
(cd docs && ./build-docs.sh)

# deploy output to 'pack/docs'
rm -fr pack/docs
mkdir pack/docs
rsync -av docs/dist/ pack/docs/
