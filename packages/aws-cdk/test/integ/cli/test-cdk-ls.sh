#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

assert "cdk ls" <<HERE
${STACK_NAME_PREFIX}-PersistentStack
${STACK_NAME_PREFIX}-conditional-resource
${STACK_NAME_PREFIX}-docker
${STACK_NAME_PREFIX}-iam-test
${STACK_NAME_PREFIX}-lambda
${STACK_NAME_PREFIX}-missing-ssm-parameter
${STACK_NAME_PREFIX}-order-providing
${STACK_NAME_PREFIX}-test-1
${STACK_NAME_PREFIX}-test-2
${STACK_NAME_PREFIX}-order-consuming
HERE

echo "✅  success"
