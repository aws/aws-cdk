#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

#------------------------------------------------------------------

for template in app sample-app; do
    echo "Trying template $template"
    setup
    cdk init -l javascript -t $template
    npm ls # this will fail if we have unmet peer dependencies
    cdk synth
done
