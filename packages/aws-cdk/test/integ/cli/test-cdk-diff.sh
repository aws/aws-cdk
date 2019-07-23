#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

function cdk_diff() {
    cdk diff $1 2>&1 || true
}

cdk_diff ${STACK_NAME_PREFIX}-test-1 | grep "AWS::SNS::Topic"
cdk_diff ${STACK_NAME_PREFIX}-test-2 | grep "AWS::SNS::Topic"

echo "✅  success"
