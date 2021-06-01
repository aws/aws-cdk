#!/bin/bash

echo "⏳ Vendoring in assert-internal..."

# clones tools/assert-internal into here
scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
src="../assert-internal"
dest="lib/assert-internal"

# Don't copy .d.ts and .js files. Recompile them again here.
rsync -a --exclude '*.d.ts' --exclude '*.js' $src/lib/ $dest

cat > $dest/README.md <<EOF
This folder contains a clone of the 'assert-internal' package.

Since the assert-internal package is not public and not jsii-able,
we cannot a declare a dependency on it.

Instead it is vended directly into the assertv2 library.
EOF

echo "✅ Vendoring in assert-internal complete"