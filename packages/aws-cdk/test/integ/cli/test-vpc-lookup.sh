#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

echo "Setting up: creating a VPC with known tags"
ENABLE_VPC_TESTING="DEFINE" cdk deploy ${STACK_NAME_PREFIX}-define-vpc
echo "Setup complete!"

# verify we can synth the importing stack now
echo "Verifying we can now import that VPC"
ENABLE_VPC_TESTING="IMPORT" cdk synth -v ${STACK_NAME_PREFIX}-import-vpc

# destroy
echo "Cleaning up..."
ENABLE_VPC_TESTING="DEFINE" cdk destroy -f ${STACK_NAME_PREFIX}-define-vpc

echo "✅  success"
