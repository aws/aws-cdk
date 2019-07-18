#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# Deploy the consuming stack which will include the producing stack
cdk deploy ${STACK_NAME_PREFIX}-order-consuming

# Destroy the providing stack which will include the consuming stack
cdk destroy -f ${STACK_NAME_PREFIX}-order-providing

echo "✅  success"
