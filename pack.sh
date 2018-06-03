#!/bin/bash
set -e
export PATH=$PWD/node_modules/.bin:$PATH

packdir="$PWD/pack"
rm -fr ${packdir}
mkdir -p ${packdir}

lerna ls | grep -v "private" | cut -d" " -f1 | xargs -n1 -I{} \
    lerna exec --scope {} --stream -- "npm pack && mv *.tgz ${packdir}"
