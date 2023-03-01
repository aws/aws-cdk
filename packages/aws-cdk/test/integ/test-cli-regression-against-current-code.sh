#!/bin/bash
set -eu
set -x
# This is a backwards compatibilty script. All logic has moved to '@aws-cdk-testing/cli-integ'
# and should be called from there directly.

# Contract: '@aws-cdk-testing/cli-integ' package is installed in ${INTEG_TOOLS}
previous=$(${INTEG_TOOLS}/bin/query-github last-release --token $GITHUB_TOKEN --prior-to $VERSION)
echo "Previous version is: $previous"

# Old tests, new CLI, new framework
exec $INTEG_TOOLS/bin/download-and-run-old-tests "$previous" --regression --use-cli-release=$VERSION cli-integ-tests
