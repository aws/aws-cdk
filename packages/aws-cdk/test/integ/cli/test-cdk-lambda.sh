#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack="${STACK_NAME_PREFIX}-lambda"

# deploy the stack
stack_arn=$(cdk deploy -v ${stack} --require-approval=never)
echo "Stack deployed successfully"

# query the lambda ARN from the output
lambda_arn=$(aws cloudformation describe-stacks --stack-name ${stack_arn} --query 'Stacks[0].Outputs[0].OutputValue' | cut -d'"' -f2)

# invoke the function
aws lambda invoke --function-name ${lambda_arn} response.out

# verify response
grep "dear asset" response.out

# destroy
cdk destroy -f ${stack}

echo "✅  success"
