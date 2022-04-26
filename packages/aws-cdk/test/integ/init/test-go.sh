#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
dist_root=$(cd ${DIST_ROOT:-.} && pwd)

header Go

#------------------------------------------------------------------

if [[ "${1:-}" == "" ]]; then
    templates="app sample-app"
else
    templates="$@"
fi

for template in $templates; do
    echo "Trying Go template $template"

    setup

    cdk init -l go $template
    go mod edit -replace github.com/aws/aws-cdk-go/awscdk=$dist_root/go/awscdk
    go mod tidy
    go test
    cdk synth
done
