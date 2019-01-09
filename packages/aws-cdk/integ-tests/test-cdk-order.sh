#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# ls order == synthesis order == provider before consumer
assert "cdk list | grep -- -order-" <<HERE
cdk-toolkit-integration-order-providing
cdk-toolkit-integration-order-consuming
HERE

echo "✅  success"
