#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack="${STACK_NAME_PREFIX}-docker"

stack_arn=$(cdk deploy -v ${stack} --require-approval=never)
echo "Stack deployed successfully"

# # destroy
cdk destroy -f ${stack}

echo "✅  success"
