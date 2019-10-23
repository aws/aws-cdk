#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

cdk diff ${STACK_NAME_PREFIX}-test-1 2>&1 | grep "AWS::SNS::Topic"
cdk diff ${STACK_NAME_PREFIX}-test-2 2>&1 | grep "AWS::SNS::Topic"

fail=0
cdk diff --fail ${STACK_NAME_PREFIX}-test-1 2>&1 || fail=1

if [ $fail -ne 1 ]; then
  fail 'cdk diff with --fail does not fail'
fi

echo "✅  success"
