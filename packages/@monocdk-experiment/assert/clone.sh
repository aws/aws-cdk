#!/bin/bash
# clones @aws-cdk/assert into here
scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
src=$(node -p 'path.dirname(require.resolve("@aws-cdk/assert/package.json"))')
# src="../../@aws-cdk/assert"
rsync -av $src/lib/ lib/
rsync -av $src/test/ test/

files="README.md LICENSE NOTICE .npmignore jest.?s"

for file in ${files}; do
  cp $src/$file .
done

npx rewrite-imports "**/*.ts"
