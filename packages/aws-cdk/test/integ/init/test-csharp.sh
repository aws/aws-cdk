#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
header C#
#------------------------------------------------------------------

# Run the test
setup

cdk init -l csharp -t app
dotnet build \
    --source https://api.nuget.org/v3/index.json \
    src
cdk synth
