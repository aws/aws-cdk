#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/../common/util.bash

header TypeScript
prepare_toolkit
preload_npm_packages

#------------------------------------------------------------------

for template in app sample-app lib; do
    echo "Trying template $template"
    cd $(mktemp -d)
    cdk init -l typescript -t $template
    npm ls # this will fail if we have unmet peer dependencies
    npm run build
    npm run test
    cdk synth
done
