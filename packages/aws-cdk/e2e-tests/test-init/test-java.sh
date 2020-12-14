#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header Java

#------------------------------------------------------------------

if [[ "${1:-}" == "" ]]; then
    templates="app sample-app"
else
    templates="$@"
fi

for template in $templates; do
    echo "Trying Java template $template"

    setup

    cdk init -l java $template
    cdk synth
done
