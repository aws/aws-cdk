#!/bin/bash
# clones tools/assert-internal into here
scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
src="../assert-internal"
rsync -av $src/lib/ lib/
rsync -av $src/test/ test/

majorversion=$(node -p 'require("../../../release.json").majorVersion')

files="README.md LICENSE NOTICE .npmignore jest.ts"

for file in ${files}; do
  cp $src/$file .
done

if [[ "$majorversion" = "2" ]]; then
  echo "Rewriting TS files..."
  npx rewrite-imports-v2 "**/*.ts"

  # This forces a recompile even if this file already exists
  rm -f tsconfig.tsbuildinfo

  echo "Done."
fi
