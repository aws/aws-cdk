#!/bin/bash
set -e
export PATH=$PWD/node_modules/.bin:$PATH

packdir="$PWD/pack"
rm -fr ${packdir}
mkdir -p ${packdir}

scopes=$(lerna ls 2>/dev/null | grep -v "(private)" | cut -d" " -f1 | xargs -n1 -I{} echo "--scope {}" | tr "\n" " ")
# Run pre-publish script, if any package defines one (we'll run npm-pack assuming stuff was built before)
lerna run ${scopes} --sort --stream prepublish
lerna exec ${scopes} --stream --parallel -- "npm pack --ignore-scripts && mv *.tgz ${packdir}"
