#!/bin/bash

echo "⏳ Vendoring in modules..."

scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir
set -euo pipefail
dest="lib/vendored"
mkdir -p $dest

# cfnspec
mkdir -p $dest/cfnspec
rsync -a --exclude '*.d.ts' --exclude '*.js' ../cfnspec/lib/ $dest/cfnspec/lib
rsync -a ../cfnspec/spec/ $dest/cfnspec/spec

# cloudformation-diff
rsync -a --exclude '*.d.ts' --exclude '*.js' ../cloudformation-diff/lib/ $dest/cloudformation-diff
find $dest/cloudformation-diff -name '*.ts' -exec sed -i '' "s^'@aws-cdk/cfnspec'^'../../cfnspec/lib'^g" '{}' \;

# assert-internal
rsync -a --exclude '*.d.ts' --exclude '*.js' ../assert-internal/lib/ $dest/assert
find $dest/assert -name '*.ts' -exec sed -i '' "s^'@aws-cdk/cloudformation-diff'^'../../cloudformation-diff'^g" '{}' \;

# readme
cat > $dest/README.md <<EOF
This folder contains vendored in CDK packages.

Since the assert-internal package is not public and not jsii-able,
we cannot a declare a dependency on it. 
The same applies for cloudformation-diff.

Instead it is vendored into the assertv2 library.
EOF

echo "✅ Vendoring complete"