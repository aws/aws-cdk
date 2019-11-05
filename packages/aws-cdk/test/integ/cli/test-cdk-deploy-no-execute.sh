#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-test-2 --no-execute)
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stacks --stack-name ${stack_arn} > ${response_json}

stack_status=$(node -e "console.log(require('${response_json}').Stacks[0].StackStatus)")
if [ "${stack_status}" -ne "REVIEW_IN_PROGRESS" ]; then
    fail "stack creation without execution failed"
fi

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-test-2

echo "✅  success"
