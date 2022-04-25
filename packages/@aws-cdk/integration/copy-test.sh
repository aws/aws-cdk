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
  for test in $module/integ.*.ts ; do
    rewrite_import $module $test
  done
  for test in $module/**/integ.*.ts ; do
    rewrite_import $module $test
  done
  rm -f "$module/**/*.bak"
  rm -f "$module/*.bak"
}

for module in $INPUT ; do
  name=$(basename $module)
  if ! [[ $name == "integ-runner" || $name == "integ-tests" || $name == "integration" ]]
  then
    mkdir -p $DESTINATION/test/$name
    cp -r $module/test/* $DESTINATION/test/$name 2>/dev/null || :
    rm $DESTINATION/test/$name/**/*.d.ts 2>/dev/null || :
    rm $DESTINATION/test/$name/**/*.js 2>/dev/null || :
    rm $DESTINATION/test/$name/**/*.test.ts 2>/dev/null || :
    rm $DESTINATION/test/$name/*.d.ts 2>/dev/null || :
    rm $DESTINATION/test/$name/*.js 2>/dev/null || :
    rm $DESTINATION/test/$name/*.test.ts 2>/dev/null || :

    echo
    echo "Processing module: $DESTINATION/test/$name"
    rewrite_imports $DESTINATION/test/$name
  fi
done



# TODO
# * Make the input folder an input parameter