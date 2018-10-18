#!/bin/bash
set -e
scriptdir=$(cd $(dirname $0) && pwd)

staging=$(mktemp -d)
mkdir -p ${staging}
cd ${staging}

cp -f ${scriptdir}/* .
cp -f ${scriptdir}/../src/index.py .

chmod +x ./aws

pip install botocore -t .

python test.py
