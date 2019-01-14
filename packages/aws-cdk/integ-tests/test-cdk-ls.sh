#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

assert "cdk ls" <<HERE
cdk-toolkit-integration-iam-test
cdk-toolkit-integration-order-providing
cdk-toolkit-integration-test-1
cdk-toolkit-integration-test-2
cdk-toolkit-integration-order-consuming
HERE

echo "✅  success"
