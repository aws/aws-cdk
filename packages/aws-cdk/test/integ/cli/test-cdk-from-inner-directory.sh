#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

function cleanup() {
  popd
}

trap cleanup EXIT INT

pushd docker
cdk diff ${STACK_NAME_PREFIX}-test-1

echo "✅  success"
