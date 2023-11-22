#!/bin/bash
# Runs "npm package" in all modules. This will produce a "dist/" directory in each module.
# Then, in each alpha module and in @aws-cdk-testing/framework-integ, runs "yarn integ", and
# removes any integration test files (snapshots, TS, and JS) that are UNCHANGED tests.
# This reduces the size of the tarball for PRs that modify a strict subset of tests.
# Later, will minify the resultant archive with esbuild for further space savings.
# Then, calls pack-collect.sh to merge all outputs into a root ./pack directory, which is
# later read by bundle-beta.sh.
#set -eu
export PATH=$PWD/node_modules/.bin:$PATH
#export PATH=$PWD/node_modules/.bin:$PATH
#export NODE_OPTIONS="--max-old-space-size=8192 ${NODE_OPTIONS:-}"
#root=$PWD

#yarn pack

#mkdir tarball && cd tarball

cd tarball

#tar -zxvf ../aws-cdk-v0.0.0.tgz

yarn ts-node --compiler-options '{"target": "es2015"}' scripts/discover-integ-tests.ts tarball/package

#cd package/packages/@aws-cdk-testing/framework-integ/test

#yarn integ >> integ-out.txt

#INTEG_OUT="$(yarn integ 2>&1)"

# Quotes preserve the newlines in the output, which are otherwise swallowed
#echo "$INTEG_OUT" >> integ-out.txt

