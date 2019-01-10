#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# Deploy the consuming stack which will include the producing stack
cdk deploy cdk-toolkit-integration-order-consuming

# Destroy the providing stack which will include the consuming stack
cdk destroy -f cdk-toolkit-integration-order-providing

echo "✅  success"
