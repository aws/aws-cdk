#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-with-nested-stack-using-parameters --parameters "MyTopicParam=ThereIsNoSpoon")
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stack-resources --stack-name ${stack_arn} > ${response_json}
resource_count=$(node -e "console.log(require('${response_json}').StackResources.length)")
if [ "${resource_count}" -ne 1 ]; then
    fail "stack has ${resource_count} resources, and we expected two"
fi

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-with-nested-stack-using-parameters

echo "✅  success"
