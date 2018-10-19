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
cp -f ${scriptdir}/src/* $PWD
cp -f ${scriptdir}/test/* $PWD

# make sure the "aws" mock is executable (codebuild loses file permissions)
chmod +x ./aws

# install deps
pip3 install -r requirements.txt -t .

# run our tests
exec python3 test.py
