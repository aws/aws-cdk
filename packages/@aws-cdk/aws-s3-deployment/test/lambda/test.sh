#!/bin/bash
#---------------------------------------------------------------------------------------------------
# exeuctes unit tests
#
# prepares a staging directory with the requirements
set -e
scriptdir=$(cd $(dirname $0) && pwd)

# prepare staging directory
staging=$(mktemp -d)
mkdir -p ${staging}
cd ${staging}

# copy src and overlay with test
cp -f ${scriptdir}/../../lib/lambda/* $PWD
cp -f ${scriptdir}/* $PWD

# this will run our tests inside the right environment
docker build .
