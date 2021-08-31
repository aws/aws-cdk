#!/bin/bash

set -e

porta_sed() {
  local lookup=$1
  local replacement=$2
  local file=$3

  # inplace replacement of sed is not portable across BSD and GNU. Use backup extension and then delete.
  sed -i'.del' "s^${lookup}^${replacement}^g" $file
  rm $file.del
}
export -f porta_sed

echo "⏳ Vendoring in modules..."

scriptdir=$(cd $(dirname $0) && pwd)
cd $scriptdir

if [[ "$PHASE" == "transform" ]]; then
  # Make the script short-circuit when running in the packages/individual-packages build context.
  # That's required because the build done by individual-pkg-gen does import re-writing when copying the TS files
  # (because it needs to know which modules are also unstable to do the rewriting correctly),
  # but the vendor.sh script runs only after the 'build' script for this package has been invoked,
  # which means any TS files copied by it successfully would not have their imports re-written.
  exit 0
fi

set -euo pipefail
dest="lib/vendored"
mkdir -p $dest

# cfnspec
mkdir -p $dest/cfnspec
rsync -a --exclude '*.d.ts' --exclude '*.js' ../cfnspec/lib/ $dest/cfnspec/lib
rsync -a ../cfnspec/spec/ $dest/cfnspec/spec

# cloudformation-diff
rsync -a --exclude '*.d.ts' --exclude '*.js' ../cloudformation-diff/lib/ $dest/cloudformation-diff
find $dest/cloudformation-diff -name '*.ts' | xargs -n1 bash -c 'porta_sed "$@"' _ '@aws-cdk/cfnspec' '../../cfnspec/lib'

# assert-internal
rsync -a --exclude '*.d.ts' --exclude '*.js' ../assert-internal/lib/ $dest/assert
find $dest/assert -name '*.ts' | xargs -n1 bash -c 'porta_sed "$@"' _ '@aws-cdk/cloudformation-diff' '../../cloudformation-diff'

# readme
cat > $dest/README.md <<EOF
This folder contains vendored in CDK packages.

Some dependencies of this package are not jsii packages.
They also cannot be bundled since they are part of the monorepo.

Instead vendor them directly into the assertv2 library.
EOF

echo "✅ Vendoring complete"
