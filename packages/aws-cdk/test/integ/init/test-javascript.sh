#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/../common/util.bash

prepare_toolkit
preload_npm_packages

#------------------------------------------------------------------

for template in app sample-app; do
    echo "Trying template $template"
    cd $(mktemp -d)
    cdk init -l javascript -t $template
    npm ls # this will fail if we have unmet peer dependencies
    cdk synth
done
