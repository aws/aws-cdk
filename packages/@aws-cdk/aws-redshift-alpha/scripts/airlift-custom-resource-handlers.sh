#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")
awscdklibdir=${scriptdir}/..

function airlift() {
  if [[ $1 != dist/core/nodejs-entrypoint-handler && ($1 = dist/core || $1 = dist/core/*) ]];
    then
      mkdir -p $awscdklibdir/core/lib/$1
      cp $customresourcedir/$2 $awscdklibdir/core/lib/$1
    else
      mkdir -p $awscdklibdir/custom-resource-handlers/$1
      cp $customresourcedir/$2 $awscdklibdir/custom-resource-handlers/$1
  fi
}

recurse() {
  local dir=$1

  for file in $dir/*; do
    if [ -f $file ]; then
      case $file in
        $customresourcedir/dist/aws-redshift-alpha/*/index.*)
          cr=$(echo $file | rev | cut -d "/" -f 2-4 | rev)
          airlift $cr $cr/index.*
          ;;
      esac
    fi

    if [ -d $file ]; then
      recurse $file
    fi
  done
}

recurse $customresourcedir/dist
