#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

outputs_path=${integ_test_dir}/outputs/outputs.json
expected_outputs=${scriptdir}/cdk-deploy-with-outputs-expected.json

stack_arn=$(cdk deploy -v ${STACK_NAME_PREFIX}-outputs-test-1 --outputs-path ${outputs_path})
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stack-resources --stack-name ${stack_arn} > ${response_json}
resource_count=$(node -e "console.log(require('${response_json}').StackResources.length)")
if [[ "${resource_count}" -ne 1 ]]; then
    fail "stack has ${resource_count} resources, and we expected one"
fi

# verify generated outputs file
generated_outputs_file="$(cat ${outputs_path})"
expected_outputs_file="$(cat ${expected_outputs})"
if [[ "${generated_outputs_file}" != "${expected_outputs_file}" ]]; then
    fail "unexpected outputs. Expected: ${expected_outputs_file} Actual: ${generated_outputs_file}"
fi 

# destroy
rm ${outputs_path}
cdk destroy -f ${STACK_NAME_PREFIX}-outputs-test-1

echo "✅  success"
