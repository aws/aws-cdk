#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/../common/util.bash
header Java
prepare_toolkit
prepare_java_packages
#------------------------------------------------------------------

# Run the test
appdir=$(mktemp -d)
cd ${appdir}

cdk init -l java -t app
mvn package
