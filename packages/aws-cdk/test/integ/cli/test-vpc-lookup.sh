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
FAILED=false
if ! ENABLE_VPC_TESTING="IMPORT" cdk synth -v ${STACK_NAME_PREFIX}-import-vpc; then
  # Don't stop here (still clean up) but remember that we failed
  echo "[MARK] Importing failed! The error will be just above this line." >&2
  FAILED=true
fi

# destroy
echo "Cleaning up..."
ENABLE_VPC_TESTING="DEFINE" cdk destroy -f ${STACK_NAME_PREFIX}-define-vpc

if $FAILED; then
  echo "Importing test failed. Disregard the cleanup log, search upward for the line saying '[MARK]'." >&2
  exit 1
else
  echo "✅  success"
fi
