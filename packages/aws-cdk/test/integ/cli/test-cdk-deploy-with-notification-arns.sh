#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------
sns_topic_name=${STACK_NAME_PREFIX}-test-topic

response_json=$(mktemp).json
aws sns create-topic --name ${sns_topic_name} > ${response_json}
sns_arn=$(node -e "console.log(require('${response_json}').TopicArn)")

setup

stack_arn=$(cdk deploy ${STACK_NAME_PREFIX}-test-2 --notification-arns ${sns_arn})
echo "Stack deployed successfully"

# verify that the stack we deployed has our notification ARN
aws cloudformation describe-stacks --stack-name ${stack_arn} > ${response_json}

notification_count=$(node -e "console.log(require('${response_json}').Stacks[0].NotificationARNs.length)")
if [[ "${notification_count}" -ne 1 ]]; then
  fail "stack has ${notification_count} SNS notification ARNs, and we expected one"
fi

notification_arn=$(node -e "console.log(require('${response_json}').Stacks[0].NotificationARNs[0])")
if [[ "${notification_arn}" != "${sns_arn}" ]]; then
  fail "stack has ${notification_arn} SNS notification ARN, and we expected ${sns_arn}"
fi

# destroy stack and delete SNS topic
cdk destroy -f ${STACK_NAME_PREFIX}-test-2
aws sns delete-topic --topic-arn ${sns_arn}

echo "✅  success"
