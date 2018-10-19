#!/bin/bash
#-------------------------------------------------------------------------------
# builds a python-lambda deployment package
#
set -euo pipefail

# prepare staging and output directory
dist=$PWD/dist
staging=$PWD/staging
rm -fr ${dist} ${staging}
mkdir -p ${dist} ${staging}
echo "staging: ${staging}"

# install python requirements
pip3 install -r requirements.txt -t "${staging}"

# copy sources
rsync -av src/ "${staging}"

# move bin/aws one level up so it can "import" awscli
cp ${staging}/bin/aws ${staging}

echo "creating lambda.zip bundle..."
cd ${staging}
zip -qr ${dist}/lambda.zip .
