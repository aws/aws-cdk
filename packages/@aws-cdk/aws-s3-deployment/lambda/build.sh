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
piptemp="$(mktemp -d)"
trap "rm -rf ${staging} ${piptemp}" EXIT

echo "staging lambda bundle at ${staging}..."

# copy sources
rsync -av src/ "${staging}"

cd ${staging}

# install python requirements
# Must use --prefix to because --target cannot be used on
# platforms that have a default --prefix set.
pip3 install --ignore-installed --prefix ${piptemp} -r ${staging}/requirements.txt
mv ${piptemp}/lib/python*/*-packages/* .
[ -d ${piptemp}/lib64 ] && mv ${piptemp}/lib64/python*/*-packages/* .
rm -fr ./awscli/examples


# create archive
zip -qr ${bundle_out} .

echo "bundle: ${bundle_out}"
