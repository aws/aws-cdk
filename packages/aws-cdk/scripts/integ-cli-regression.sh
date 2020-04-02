#!/bin/bash
# 
# Run only local integration tests.
#
set -eu

scriptdir=$(cd $(dirname $0) && pwd)
repo_root=$(realpath ${scriptdir}/..)

echo "Running regression tests against local code"
${repo_root}/test/integ/run-against-repo ${repo_root}/test/integ/test-cli-regression-against-current-code.sh

echo "Running regression tests against local CLI and published framework"
${repo_root}/test/integ/run-against-repo ${repo_root}/test/integ/test-cli-regression-against-latest-release.sh