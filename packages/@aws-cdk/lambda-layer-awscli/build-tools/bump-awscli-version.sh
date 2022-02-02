#!/bin/bash
set -eu
scriptdir=$(cd $(dirname $0) && pwd)

package=awscli
tmpfile=_pip.json

curl -LsSf https://pypi.org/pypi/awscli/json > $tmpfile
trap "rm $tmpfile" EXIT
version=$(node -p "require('./${tmpfile}').info.version")

if [[ $version != 1.* ]]; then
    echo "Expected version 1.*, got ${version}" >&2
    exit 1
fi

echo "AWS CLI is currently at ${version}"

echo $version > $scriptdir/../awscli.version
