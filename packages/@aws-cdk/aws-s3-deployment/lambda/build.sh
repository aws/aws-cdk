#!/bin/bash
#-------------------------------------------------------------------------------
# builds a python-lambda deployment package
#
set -euo pipefail
set -x

# make sure we run from the script directory
cd $(dirname $0)

# clean up old bundle
bundle_out="$PWD/bundle.zip"
rm -f ${bundle_out}

# prepare staging
staging="$(mktemp -d)"
rm -fr ${staging}
mkdir -p ${staging}

echo "staging lambda bundle at ${staging}..."

# copy sources
rsync -av src/ "${staging}"

cd ${staging}

# install python requirements
pip3 install -r requirements.txt -t $PWD

# create archive
zip -qr ${bundle_out} $PWD

echo "bundle: ${bundle_out}"