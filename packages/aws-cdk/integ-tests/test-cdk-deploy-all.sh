#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack_arns=$(cdk deploy cdk-toolkit-integration-test-\*)
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
lines="$(echo "${stack_arns}" | wc -l)"
if [ "${lines}" -ne 2 ]; then
    echo "-- output -----------"
    echo "${stack_arns}"
    echo "---------------------"
    fail "cdk deploy returned ${lines} arns and we expected 2"
fi

cdk destroy -f cdk-toolkit-integration-test-\*

echo "✅  success"
