#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

bootstrap_stack_name="toolkit-stack-1-${RANDOM}"

# deploy with --no-execute (leaves stack in review)
cdk bootstrap --toolkit-stack-name ${bootstrap_stack_name} --no-execute

response_json=$(mktemp).json
aws cloudformation describe-stacks --stack-name ${bootstrap_stack_name} > ${response_json}

stack_status=$(node -e "console.log(require('${response_json}').Stacks[0].StackStatus)")
if [ ! "${stack_status}" == "REVIEW_IN_PROGRESS" ]; then
    fail "Expected stack to be in status REVIEW_IN_PROGRESS but got ${stack_status}"
fi

# destroy
aws cloudformation delete-stack --stack-name ${bootstrap_stack_name}

echo "✅  success"
