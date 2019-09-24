#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

cat > cdk.context.json <<HERE
{
  "contextkey": "this is the context value"
}
HERE


echo "Testing for the context value"
cdk context 2>&1 | grep "this is the context value" > /dev/null

# Test that deleting the contextkey works
cdk context --reset contextkey
cdk context 2>&1 | grep "this is the context value" > /dev/null && { echo "Should not contain key"; exit 1; } || true

# Test that forced delete of the context key does not error
cdk context -f --reset contextkey

rm -f cdk.context.json

echo "✅  success"
