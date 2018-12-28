#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# ls order == synthesis order == provider before consumer
assert "cdk list cdk-toolkit-integration-consuming cdk-toolkit-integration-providing" <<HERE
cdk-toolkit-integration-providing
cdk-toolkit-integration-consuming
HERE

echo "✅  success"
