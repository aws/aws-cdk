#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
customresourcedir=${scriptdir}/../../custom-resource-handlers
awscdklibdir=${scriptdir}/..

list_custom_resources() {
  for dir in $(ls $customresourcedir/lib); do
    echo lib/$dir/$(ls $customresourcedir/lib/$dir)
  done
}

cr_dirs=$(list_custom_resources)

cd $awscdklibdir
mkdir -p $awscdklibdir/custom-resource-handlers

for dir in $cr_dirs; do
  mkdir -p $awscdklibdir/custom-resource-handlers/$dir
  cp $customresourcedir/$dir/index.js $awscdklibdir/custom-resource-handlers/$dir
done
