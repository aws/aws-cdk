#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header TypeScript

#------------------------------------------------------------------

for template in app sample-app lib; do
    echo "Trying template $template"

    setup

    cdk init -l typescript -t $template
    npm ls # this will fail if we have unmet peer dependencies
    npm run build
    npm run test
    cdk synth
done
