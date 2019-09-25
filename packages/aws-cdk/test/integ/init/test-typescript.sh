#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header TypeScript

#------------------------------------------------------------------

if [[ "${1:-}" == "" ]]; then
    templates="app sample-app lib"
else
    templates="$@"
fi

for template in $templates; do
    echo "Trying template $template"

    setup

    cdk init -l typescript -t $template
    npm ls # this will fail if we have unmet peer dependencies
    npm run build
    npm run test
    cdk synth
done
