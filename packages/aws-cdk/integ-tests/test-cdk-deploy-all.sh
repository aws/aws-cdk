#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack_arns=$(cdk deploy)
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
lines="$(echo "${stack_arns}" | wc -l)"
if [ "${lines}" -ne 2 ]; then
    fail "cdk deploy returned ${lines} arns and we expected 2"
fi

cdk destroy -f cdk-toolkit-integration-test-1
cdk destroy -f cdk-toolkit-integration-test-2

echo "✅  success"
