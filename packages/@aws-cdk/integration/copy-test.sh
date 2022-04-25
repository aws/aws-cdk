#!/bin/bash
set -euo pipefail

DESTINATION="."
INPUT="/Users/otaviom/projects/aws-cdk/packages/@aws-cdk/*"

rewrite_import() {
  module=$1
  test=$2
  echo "Rewriting $test"
  name=$(basename $module)
  sed -i '.bak' -E "s/^(import .* from) '(\.\.\/)+lib'/\1 '@aws-cdk\/$name'/" $test
}

rewrite_imports() {
  module=$1
  shopt -s nullglob
  for file in $module/*.ts ; do
    rewrite_import $module $file
  done
  for file in $module/**/*.ts ; do
    rewrite_import $module $file
  done
  find $module -name "*.bak" -type f -delete
}

for module in $INPUT ; do
  name=$(basename $module)
  if ! [[ $name == "integ-runner" || $name == "integ-tests" || $name == "integration" ]]
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



# TODO
# * Make the input folder an input parameter