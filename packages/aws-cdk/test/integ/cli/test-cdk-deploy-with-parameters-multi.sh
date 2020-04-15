#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

paramVal1="${STACK_NAME_PREFIX}bazinga"
paramVal2="${STACK_NAME_PREFIX}=jagshemash"

stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-param-test-3 --parameters "TopicNameParam=${paramVal1}" --parameters "OtherTopicNameParam=${paramVal2}")
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stack-resources --stack-name ${stack_arn} > ${response_json}
resource_count=$(node -e "console.log(require('${response_json}').StackResources.length)")

# verify whether the stack has the same parameter values as we passed in cli
for (( i=0; i<$resource_count; i++ )); do
    passedParameterVal=$(node -e "console.log(require('${response_json}').StackResources[$i].PhysicalResourceId.split(':').reverse()[0])")
    
    if ! [[ "${passedParameterVal}" =~ ^(${paramVal1}|{$paramVal2})$ ]]; then
        fail "expected stack to have parameter: ${passedParameterVal}"
    fi
done;

# verify the number of resources in the stack
if [ "${resource_count}" -ne 2 ]; then
    fail "stack has ${resource_count} resources, and we expected two"
fi

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-param-test-3


echo "✅  success"
