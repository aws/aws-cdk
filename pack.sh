#!/bin/bash
# Runs "npm package" in all modules. This will produce a "dist/" directory in each module.
# Then, calls pack-collect.sh to merge all outputs into a root ./pack directory, which is
# later read by bundle-beta.sh.
set -e
export PATH=$PWD/node_modules/.bin:$PATH

packdir="$PWD/pack"
rm -fr ${packdir}
mkdir -p ${packdir}

scopes=$(lerna --concurrency 1 ls 2>/dev/null | grep -v "(private)" | cut -d" " -f1 | xargs -n1 -I{} echo "--scope {}" | tr "\n" " ")

# Run the "cdk-package" script in all modules. For jsii modules, this invokes jsii-pacmak which generates and builds multi-language
# outputs. For non-jsii module, it will just run "npm pack" and place the output in dist/npm (which is similar to how pacmak outputs it).
lerna --concurrency 1 run ${scopes} --sort --stream package

# Collect dist/ from all modules into the root dist/
/bin/bash ./pack-collect.sh
