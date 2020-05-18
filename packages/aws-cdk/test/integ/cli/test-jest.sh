#!/bin/bash
# A number of tests have been written in TS/Jest, instead of bash.
# This script runs them.

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

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
