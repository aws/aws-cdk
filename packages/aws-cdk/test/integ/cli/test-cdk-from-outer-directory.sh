#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

pushd ..
set +e
output="$(cdk diff ${STACK_NAME_PREFIX}-test-1 2>&1)"
set -e

if [[ "${output}" != *"--app is required"* ]]; then
  fail "unexpected output when running 'cdk diff' from outer directory: ${output}"
fi

echo "✅  success"
