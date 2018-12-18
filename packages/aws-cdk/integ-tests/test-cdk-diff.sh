#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

function cdk_diff() {
    cdk diff $1 2>&1 || true
}

assert_lines "$(cdk_diff cdk-toolkit-integration-test-1)" 2
assert_lines "$(cdk_diff cdk-toolkit-integration-test-2)" 3

echo "✅  success"
