#!/bin/bash

scriptdir=$(cd $(dirname $0) && pwd)
targetdir=${scriptdir}/..
customresourcedir=$(node -p "path.dirname(require.resolve('@aws-cdk/custom-resource-handlers/package.json'))")

function airlift() {
    mkdir -p $targetdir/lib/custom-resource-handlers/$1
    cp $customresourcedir/$2 $targetdir/lib/custom-resource-handlers/$1
}

function recurse() {
  local dir=$1

  for file in $dir/*; do
    if [ -f $file ]; then
      case $file in
        $customresourcedir/dist/aws-s3/*/index.js)
          cr=$(echo $file | rev | cut -d "/" -f 2-4 | rev)
          airlift $cr $cr/index.js
          ;;
      esac
    fi

    if [ -d $file ]; then
      recurse $file
    fi
  done
}

recurse $customresourcedir/dist
