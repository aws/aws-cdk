#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header C#

#------------------------------------------------------------------

if [[ "${1:-}" == "" ]]; then
    templates="app sample-app"
else
    templates="$@"
fi

for template in $templates; do
    echo "Trying C# template $template"

    setup

    cdk init -l csharp $template
    cdk synth
done
