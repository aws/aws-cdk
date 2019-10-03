#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
header Java
#------------------------------------------------------------------

# Run the test
setup

cdk init -l java -t app
mvn package
