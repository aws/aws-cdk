#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

toolkit_stack_name_1="toolkit-stack-1-${RANDOM}"
toolkit_stack_name_2="toolkit-stack-2-${RANDOM}"

# deploy two toolkit stacks into the same environment (see #1416)
cdk bootstrap --toolkit-stack-name ${toolkit_stack_name_1} --tags Foo=Bar
cdk bootstrap --toolkit-stack-name ${toolkit_stack_name_2}

# just check that the new stack exists
aws cloudformation describe-stack-resources --stack-name ${toolkit_stack_name_1}

# get tags from the new stack
tag_stack_1=$(aws cloudformation describe-stacks --stack-name ${toolkit_stack_name_1} --query "Stacks[0].Tags[?Key=='Foo'].Value" --output text)

# check if tag is not equal to bar
if [[ "${tag_stack_1}" != "Bar" ]]; then
    fail "toolkit tags test expect Bar but got ${tag_stack_1}"
fi

# clean up
aws cloudformation delete-stack --stack-name ${toolkit_stack_name_1}
aws cloudformation delete-stack --stack-name ${toolkit_stack_name_2}

echo "✅  success"
