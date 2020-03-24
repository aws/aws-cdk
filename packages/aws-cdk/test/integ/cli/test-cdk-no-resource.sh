#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# Deploy without resource
NO_RESOURCE="TRUE" cdk deploy ${STACK_NAME_PREFIX}-conditional-resource

# Verify that deploy has been skipped
deployed=1
aws cloudformation describe-stacks --stack-name ${STACK_NAME_PREFIX}-conditional-resource > /dev/null 2>&1 || deployed=0

if [ $deployed -ne 0 ]; then
  fail 'Stack has been deployed'
fi

# Deploy the stack with resources
cdk deploy ${STACK_NAME_PREFIX}-conditional-resource

# Now, deploy the stack without resources
NO_RESOURCE="TRUE" cdk deploy ${STACK_NAME_PREFIX}-conditional-resource

# Verify that the stack has been destroyed
destroyed=0
aws cloudformation describe-stacks --stack-name ${STACK_NAME_PREFIX}-conditional-resource > /dev/null 2>&1 || destroyed=1

if [ $destroyed -ne 1 ]; then
  fail 'Stack has not been destroyed'
fi

