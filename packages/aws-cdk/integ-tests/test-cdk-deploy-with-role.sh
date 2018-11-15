#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

role_name=cdk-integ-test-role
delete_role() {
    for policy_name in $(aws iam list-role-policies --role-name $role_name --output text --query PolicyNames); do
        aws iam delete-role-policy --role-name $role_name --policy-name $policy_name
    done
    aws iam delete-role --role-name $role_name
}

delete_role || echo 'Role does not exist yet'

role_arn=$(aws iam create-role \
    --output text --query Role.Arn \
    --role-name $role_name  \
    --assume-role-policy-document file://<(echo '{
        "Version": "2012-10-17",
        "Statement": [{
            "Action": "sts:AssumeRole",
            "Principal": { "Service": "cloudformation.amazonaws.com" },
            "Effect": "Allow"
        }]
    }'))
trap delete_role EXIT
aws iam put-role-policy \
    --role-name $role_name  \
    --policy-name DefaultPolicy  \
    --policy-document file://<(echo '{
        "Version": "2012-10-17",
        "Statement": [{
            "Action": "*",
            "Resource": "*",
            "Effect": "Allow"
        }]
    }')

echo "Sleeping a bit to improve chances of the role having propagated"
sleep 5

setup

stack_arn=$(cdk --role-arn $role_arn deploy cdk-toolkit-integration-test-2)
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
assert_lines "${stack_arn}" 1

# verify the number of resources in the stack
response_json=$(mktemp).json
aws cloudformation describe-stack-resources --stack-name ${stack_arn} > ${response_json}
resource_count=$(node -e "console.log(require('${response_json}').StackResources.length)")
if [ "${resource_count}" -ne 2 ]; then
    fail "stack has ${resource_count} resources, and we expected two"
fi

# destroy
cdk destroy --role-arn $role_arn -f cdk-toolkit-integration-test-2

echo "✅  success"
