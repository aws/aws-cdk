#!/bin/bash

echo "⏳ Vendoring in modules..."

scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
dest="lib/vendored"
mkdir -p $dest

# Don't copy .d.ts and .js files. Recompile them again here.
rsync -a --exclude '*.d.ts' --exclude '*.js' ../cloudformation-diff/lib/ $dest/cloudformation-diff
rsync -a --exclude '*.d.ts' --exclude '*.js' ../assert-internal/lib/ $dest/assert

cat > $dest/README.md <<EOF
This folder contains vendored in CDK packages.

Since the assert-internal package is not public and not jsii-able,
we cannot a declare a dependency on it. 
The same applies for cloudformation-diff.

Instead it is vendored into the assertv2 library.
EOF

echo "✅ Vendoring complete"