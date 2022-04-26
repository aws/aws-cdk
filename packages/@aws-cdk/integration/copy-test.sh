#!/bin/bash
set -euo pipefail

DESTINATION="."
INPUT="/Users/otaviom/projects/aws-cdk/packages/@aws-cdk/*"

rewrite_import() {
  module=$1
  test=$2
  echo "Rewriting $test"
  name=$(basename $module)
  sed -i '.bak' -E "s/(\.\.\/)+lib/@aws-cdk\/$name/" $test
  sed -i '.bak' -E "s/(@aws-cdk\/[\a-z0-9\-]+)\/[^']*/\1/" $test 2>/dev/null || :
}

rewrite_imports() {
  module=$1
  shopt -s nullglob
  for file in $(find $module -name "*.ts"); do 
    rewrite_import $module $file
  done
  find $module -name "*.bak" -type f -delete
}

for module in $INPUT ; do
  name=$(basename $module)
  if ! [[ $name == "integ-runner" || $name == "integ-tests" || $name == "integration" || $name == "cfnspec" || $name == "core" ]]
  then
    mkdir -p $DESTINATION/test/$name
    cp -r $module/test/* $DESTINATION/test/$name 2>/dev/null || :
    find $DESTINATION/test/$name -name "*.d.ts" -type f -delete
    find $DESTINATION/test/$name -name "*.js" -type f -delete
    find $DESTINATION/test/$name -name "*.test.ts" -type f -delete
    echo
    echo "Processing module: $DESTINATION/test/$name"
    rewrite_imports $DESTINATION/test/$name
  fi
done

# Ad-hoc transformations


# Cleaning up leftovers
find test -name "asset.*" -exec rm -rf "{}" \; 2>/dev/null || :
rm -rf $DESTINATION/test/pipelines/blueprint
rm $DESTINATION/test/aws-eks/cluster-resource-handler-mocks.ts

# TODO
# * Make the input folder an input parameter