#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

paramVal1="${STACK_NAME_PREFIX}bazinga"
paramVal2="${STACK_NAME_PREFIX}=jagshemash"

stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-param-test-3 --parameters "DisplayNameParam=${paramVal1}" --parameters "OtherDisplayNameParam=${paramVal2}")
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# retrieve stack parameters
response_json=$(mktemp).json
aws cloudformation describe-stacks --stack-name ${stack_arn} > ${response_json}
parameter_count=$(node -e "console.log(require('${response_json}').Stacks[0].Parameters.length)")

# verify stack parameter count
if [ "${parameter_count}" -ne 2 ]; then
    fail "stack has ${parameter_count} parameters, and we expected two"
fi

# verify stack parameters
for (( i=0; i<$parameter_count; i++ )); do
    passedParameterVal=$(node -e "console.log(require('${response_json}').Stacks[0].Parameters[$i].ParameterValue)")
    if ! [[ "${passedParameterVal}" =~ ^($paramVal1|$paramVal2)$ ]]; then
        fail "Unexpected parameter: '${passedParameterVal}'. Expected parameter values: '${paramVal1}' or '${paramVal2}'"
    fi
done;

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-param-test-3


echo "✅  success"
