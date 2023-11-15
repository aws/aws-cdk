#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")
awscdklibdir=${scriptdir}/..

list_stable_custom_resources() {
  for file in $customresourcedir/dist/*[^-alpha]/*/index.*; do
    echo $file | rev | cut -d "/" -f 2-4 | rev
  done
}

list_dependent_python_modules() {
  for file in $customresourcedir/dist/*[^-alpha]/*/*/__init__.py; do
    echo $file | rev | cut -d "/" -f 2-5 | rev
  done
}

customresources=$(list_stable_custom_resources)
pythonmodules=$(list_dependent_python_modules)

echo $customresources
echo $pythonmodules

cd $awscdklibdir
mkdir -p $awscdklibdir/custom-resource-handlers

for cr in $customresources; do
  mkdir -p $awscdklibdir/custom-resource-handlers/$cr
  cp $customresourcedir/$cr/index.* $awscdklibdir/custom-resource-handlers/$cr
done

for pm in $pythonmodules; do
  mkdir -p $awscdklibdir/custom-resource-handlers/$pm
  cp $customresourcedir/$pm/__init__.py $awscdklibdir/custom-resource-handlers/$pm
done
