#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/../common/util.bash
header C#
prepare_toolkit
prepare_nuget_packages
#------------------------------------------------------------------

# Run the test
appdir=$(mktemp -d)
cd ${appdir}

cdk init -l csharp -t app
dotnet build src
cdk synth hello-cdk-1
