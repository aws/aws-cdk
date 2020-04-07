#!/bin/bash
# 
# Run only local integration tests.
#
set -eu

scriptdir=$(cd $(dirname $0) && pwd)

echo "Running local integration tests"
./test/integ/run-against-repo test/integ/cli/test.sh
