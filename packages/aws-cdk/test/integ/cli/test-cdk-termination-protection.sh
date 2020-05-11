#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

stack="${STACK_NAME_PREFIX}-termination-protection"

stack_arn=$(cdk deploy -v ${stack} --require-approval=never)
echo "Stack deployed successfully"

# try to destroy
destroyed=1
cdk destroy -f ${stack} 2>&1 || destroyed=0

if [ $destroyed -eq 1 ]; then
  fail 'cdk destroy succeeded on a stack with termination protection enabled'
fi

# disable termination protection and destroy stack
aws cloudformation update-termination-protection --no-enable-termination-protection --stack-name ${stack}
cdk destroy -f ${stack}

echo "✅  success"
