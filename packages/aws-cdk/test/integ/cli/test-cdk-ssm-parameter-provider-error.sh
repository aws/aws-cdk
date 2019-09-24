#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

parameterName=/does/not/exist
account=$(node -p "($(aws sts get-caller-identity)).Account")
region=${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}

function cdk_synth() {
    (cdk synth $@ 2>&1 || true) | strip_color_codes
}

assert "cdk_synth ${STACK_NAME_PREFIX}-missing-ssm-parameter -c test:ssm-parameter-name=${parameterName}" <<HERE
[Error at /${STACK_NAME_PREFIX}-missing-ssm-parameter] SSM parameter not available in account ${account}, region ${region}: /does/not/exist
Found errors
HERE

echo "✅  success"
