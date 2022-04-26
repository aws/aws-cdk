#!/bin/bash
# clones @aws-cdk/assert into here
scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
src="../../@aws-cdk/assert-internal"
rsync -av $src/lib/ lib/
rsync -av $src/test/ test/

files="README.md LICENSE NOTICE .npmignore jest.ts"

for file in ${files}; do
  cp $src/$file .
done

npx rewrite-imports "**/*.ts"
