#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
echo 'CLI Integration Tests'
echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'

current_version=$(node -p "require('${scriptdir}/../../../package.json').version")

# This allows injecting different versions, not just the current one.
# Useful when testing.
export VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-${current_version}}

cd $scriptdir

# Install these dependencies that the tests (written in Jest) need.
# Only if we're not running from the repo, because if we are the
# dependencies have already been installed by the containing 'aws-cdk' package's
# package.json.
if ! npx --no-install jest --version; then
  echo 'Looks like we need to install jest first. Hold on.' >& 2
  npm install --prefix . jest aws-sdk
fi

npx jest --runInBand --verbose "$@"