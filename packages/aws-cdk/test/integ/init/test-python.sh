#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header Python

#------------------------------------------------------------------

if [[ "${1:-}" == "" ]]; then
    templates="app sample-app"
else
    templates="$@"
fi

for template in $templates; do
    echo "Trying Python template $template"

    setup

    cdk init -l python $template

    source .env/bin/activate
    type -p pip
    pip install -r requirements.txt

    cdk synth
done
