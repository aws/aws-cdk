#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# Deploy all stacks with an ordering component between them
cdk deploy cdk-toolkit-integration-order-\*

# Destroy them again
cdk destroy -f cdk-toolkit-integration-order-\*

echo "✅  success"
