#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# STACK_NAME_PREFIX is used in OtherTopicNameParam to allow multiple instances
# of this test to run in parallel, othewise they will attempt to create the same SNS topic.
stack_arns=$(cdk deploy ${STACK_NAME_PREFIX}-param-test-\* --parameters "${STACK_NAME_PREFIX}-param-test-1:TopicNameParam=${STACK_NAME_PREFIX}bazinga" --parameters "${STACK_NAME_PREFIX}-param-test-2:OtherTopicNameParam=${STACK_NAME_PREFIX}ThatsMySpot" --parameters "${STACK_NAME_PREFIX}-param-test-3:DisplayNameParam=${STACK_NAME_PREFIX}HeyThere" --parameters "${STACK_NAME_PREFIX}-param-test-3:OtherDisplayNameParam=${STACK_NAME_PREFIX}AnotherOne")
echo "Stack deployed successfully"

# verify that we only deployed a single stack (there's a single ARN in the output)
lines="$(echo "${stack_arns}" | wc -l)"
if [ "${lines}" -ne 3 ]; then
    echo "-- output -----------"
    echo "${stack_arns}"
    echo "---------------------"
    fail "cdk deploy returned ${lines} arns and we expected 2"
fi

cdk destroy -f ${STACK_NAME_PREFIX}-param-test-\*

echo "✅  success"
