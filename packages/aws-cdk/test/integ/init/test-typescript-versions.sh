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
    header TypeScript v$version

    setup

    set -x
    node --version
    npm --version

    cdk init -l typescript sample-app --generate-only
    sed '/\"devDependencies\"/,/}/ d; /^$/d' package.json > package.json.new && rm package.json && mv package.json.new package.json
    npm install --save-dev typescript@$version
    npm install # Older versions of npm require this to be a separate step from the one above
    npm prune && npm ls
    rm test/*
    npm run build
    cdk synth

    set +x
done
