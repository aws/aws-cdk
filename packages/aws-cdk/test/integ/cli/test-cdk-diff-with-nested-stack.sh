#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# assert that the inner resource is shown
ret=$(cdk diff ${STACK_NAME_PREFIX}-with-nested-stack 2>&1 | grep "AWS::SNS::Topic")

if [ $ret -ne 0 ]; then
    fail "couldn't read the nested stack"
fi

echo "✅  success"
