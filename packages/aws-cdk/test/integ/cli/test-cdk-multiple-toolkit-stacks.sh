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
cdk bootstrap --toolkit-stack-name ${toolkit_stack_name_2} --tags Foo=Bar

# just check that the new stack exists
aws cloudformation describe-stack-resources --stack-name ${toolkit_stack_name_1}
aws cloudformation describe-stack-resources --stack-name ${toolkit_stack_name_2}

# clean up
aws cloudformation delete-stack --stack-name ${toolkit_stack_name_1}
aws cloudformation delete-stack --stack-name ${toolkit_stack_name_2}

echo "✅  success"
