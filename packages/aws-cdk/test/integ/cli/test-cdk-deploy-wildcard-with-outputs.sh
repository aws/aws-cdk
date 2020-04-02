#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

outputs_file=${integ_test_dir}/outputs/outputs.json
expected_outputs=${scriptdir}/cdk-deploy-wildcard-with-outputs-expected.json

# deploy all outputs stacks
cdk deploy ${STACK_NAME_PREFIX}-outputs-test-\* --outputs-file ${outputs_file}
echo "Stacks deployed successfully"

# verify generated outputs file
generated_outputs_file="$(cat ${outputs_file})"
expected_outputs_file="$(cat ${expected_outputs})"
if [[ "${generated_outputs_file}" != "${expected_outputs_file}" ]]; then
    fail "unexpected outputs. Expected: ${expected_outputs_file} Actual: ${generated_outputs_file}"
fi 

# destroy
rm ${outputs_file}
cdk destroy -f ${STACK_NAME_PREFIX}-outputs-test-1
cdk destroy -f ${STACK_NAME_PREFIX}-outputs-test-2

echo "✅  success"
