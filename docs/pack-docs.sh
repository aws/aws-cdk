#!/bin/bash
# Development script to build all docs packages and rsync them into $root/dist so that build-docs.sh can work.
set -euo pipefail
cd ..

dist=$(pwd)/dist
pacmak=$(pwd)/tools/cdk-build-tools/node_modules/.bin/jsii-pacmak
scopes=$(lerna ls 2>/dev/null | grep -v "(private)" | cut -d" " -f1 | xargs -n1 -I{} echo "--scope {}" | tr "\n" " ")

mkdir -p $dist
node_modules/.bin/lerna exec --no-bail ${scopes} -- $pacmak -t sphinx -o dist/sphinx || echo 'Swallowing error'
node_modules/.bin/lerna exec --no-bail ${scopes} -- rsync -av dist/ $dist/ || echo 'Swallowing error'
