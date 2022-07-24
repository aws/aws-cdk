#!/bin/bash

###
# Uses esbuild to minify the built aws-cdk-lib Javascript files to reduce module size
# and speed up loading times.
#
# In local testing, this changed the average time for loading `aws-cdk-lib` from
# 1112ms to 832ms (25% reduction).
#
# There are potentially even more savings available if we were to bundle each submodule
# into a single file; however, experiments with this (so far) have not worked due to circular
# dependencies in imports that lead to errors like "... is not a constructor". There are also
# potentially concerns with relative file usage (e.g., `__dirname`) in source. For now, this helps a bit.
###

scriptdir=$(cd $(dirname $0) && pwd)
cd ${scriptdir}/..

find . -name '*.js' ! -name '.eslintrc.js' ! -path '*node_modules*' | xargs npx esbuild \
  --sourcemap \
  --platform=node \
  --format=cjs \
  --minify-whitespace \
  --minify-syntax \
  --tsconfig=tsconfig.json \
  --allow-overwrite \
  --outdir=.
