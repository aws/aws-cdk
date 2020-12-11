#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
echo 'UberCDK Integration Tests'
echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'

cd $scriptdir

../common/jest-test.bash
