#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
integdir=$(dirname $scriptdir)
source ${scriptdir}/common.bash

header TypeScript Versions

#------------------------------------------------------------------

MIN_SUPPORTED_TS_VERSION=${1:-"3.9"}
SUPPORTED_TS_VERSIONS=$(node ${integdir}/typescript-versions.js ${MIN_SUPPORTED_TS_VERSION})

for version in $SUPPORTED_TS_VERSIONS; do
    echo "Testing against TypeScript v$version"

    setup

    cdk init -l typescript sample-app --generate-only
    npm pkg delete devDependencies
    npm install --save-dev typescript@$version
    npm prune && npm ls
    rm test/*
    npm run build
    cdk synth
done
