#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")
awscdklibdir=${scriptdir}/..

list_custom_resources() {
  for file in $customresourcedir/dist/aws-amplify-alpha/*/index.js; do
    echo $file | rev | cut -d "/" -f 2-4 | rev
  done
}

customresources=$(list_custom_resources)

echo $customresources

cd $awscdklibdir
mkdir -p $awscdklibdir/custom-resource-handlers

for cr in $customresources; do
  mkdir -p $awscdklibdir/custom-resource-handlers/$cr
  cp $customresourcedir/$cr/index.js $awscdklibdir/custom-resource-handlers/$cr
done
