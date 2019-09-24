#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
header Python
#------------------------------------------------------------------

for template in app sample-app; do
    echo "Trying template $template"
    setup

    cdk init -l python $template

    source .env/bin/activate
    type -p pip
    pip install -r requirements.txt
    cdk synth
done
