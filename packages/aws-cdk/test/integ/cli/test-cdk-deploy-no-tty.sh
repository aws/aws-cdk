#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

# redirect /dev/null to stdin, which means there will not be tty attached
# since this stack includes security-related changes, the deployment should
# immediately fail because we can't confirm the changes
if cdk deploy ${STACK_NAME_PREFIX}-iam-test < /dev/null; then
    fail "test failed. we expect 'cdk deploy' to fail if there are security-related changes and no tty"
fi

echo "✅  success"
