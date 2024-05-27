#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")
awscdklibdir=${scriptdir}/..

function airlift() {
  mkdir -p $awscdklibdir/custom-resource-handlers/$1
  cp $customresourcedir/$2 $awscdklibdir/custom-resource-handlers/$1
}

function recurse() {
  local dir=$1

  for file in $dir/*; do
    if [ -f $file ]; then
      case $file in
        $customresourcedir/dist/aws-glue-alpha/*.generated.ts)
          cr=$(echo $file | rev | cut -d "/" -f 2-3 | rev)
          airlift $cr $cr/*.generated.ts
          ;;
        $customresourcedir/dist/aws-glue-alpha/*/index.*)
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

recurse $customresourcedir/dist/aws-glue-alpha
