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
cp -f ${scriptdir}/* .
cp -f ${scriptdir}/../src/index.py .
cp -f ${scriptdir}/../requirements.txt .

# make sure the "aws" mock is executable (code build loses file permissions)
chmod +x ./aws

# install deps
pip3 install -r requirements.txt -t .

# run our tests
exec python3 test.py
