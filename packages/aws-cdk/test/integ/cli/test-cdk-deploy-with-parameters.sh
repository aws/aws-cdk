#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# STACK_NAME_PREFIX is used in TopicNameParam to allow multiple instances
# of this test to run in parallel, othewise they will attempt to create the same SNS topic.
stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-param-test-1 --parameters "TopicNameParam=${STACK_NAME_PREFIX}bazinga")
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stack-resources --stack-name ${stack_arn} > ${response_json}
resource_count=$(node -e "console.log(require('${response_json}').StackResources.length)")
if [ "${resource_count}" -ne 1 ]; then
    fail "stack has ${resource_count} resources, and we expected one"
fi

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-param-test-1

echo "✅  success"
