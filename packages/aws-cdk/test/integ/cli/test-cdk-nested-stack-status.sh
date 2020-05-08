#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# when deploying a nested stack
found_topic=$(mktemp)
cdk deploy ${STACK_NAME_PREFIX}-with-nested-stack 2>&1 | grep -o -e "AWS::SNS::Topic" | uniq >> ${found_topic}
echo "Stack deployed successfully"

# assert that the resource inside the nested stack (a SNS Topic) has at least one status message being displayed
assert_lines "${found_topic}" 1

# destroy
cdk destroy -f ${STACK_NAME_PREFIX}-with-nested-stack

echo "✅  success"
