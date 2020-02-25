#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

set +e
# this will hang if we introduce https://github.com/aws/aws-cdk/issues/6403 again.
cdk deploy -v ${STACK_NAME_PREFIX}-failed
deploy_status=$?
set -e

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-failed

if [ "${deploy_status}" -eq 0 ]; then
  fail "stack deployment should have failed"
fi

echo "✅  success"
