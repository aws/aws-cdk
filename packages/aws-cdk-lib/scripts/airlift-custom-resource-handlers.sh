#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
awscdklibdir=${scriptdir}/..
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")

function airlift() {
  # core needs to be airlifted directly to core to prevent circular dependencies
  if [[ $1 != dist/core/nodejs-entrypoint-handler && ($1 = dist/core || $1 = dist/core/*) ]];
    then
      mkdir -p $awscdklibdir/core/lib/$1
      cp $customresourcedir/$2 $awscdklibdir/core/lib/$1
    else
      mkdir -p $awscdklibdir/custom-resource-handlers/$1
      cp $customresourcedir/$2 $awscdklibdir/custom-resource-handlers/$1
  fi
}

function recurse() {
  local dir=$1

  for file in $dir/*; do
    if [ -f $file ]; then
      case $file in
        $customresourcedir/dist/*[^-alpha]/*.generated.ts)
          cr=$(echo $file | rev | cut -d "/" -f 2-3 | rev)
          airlift $cr $cr/*.generated.ts
          ;;
        $customresourcedir/dist/*[^-alpha]/*/index.*)
          cr=$(echo $file | rev | cut -d "/" -f 2-4 | rev)
          airlift $cr $cr/index.*
          ;;
        $customresourcedir/dist/*[^-alpha]/*/*/__init__.py)
          cr=$(echo $file | rev | cut -d "/" -f 2-5 | rev)
          airlift $cr $cr/__init__.py
          ;;
      esac
    fi

    if [ -d $file ]; then
      recurse $file
    fi
  done
}

recurse $customresourcedir/dist
