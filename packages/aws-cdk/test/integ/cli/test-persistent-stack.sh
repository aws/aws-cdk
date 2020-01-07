#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

echo "Creating/updating the persistent stack"
cdk deploy ${STACK_NAME_PREFIX}-PersistentStack

# NOTE: No 'destroy' on that stack on purpose
echo "✅  success"
