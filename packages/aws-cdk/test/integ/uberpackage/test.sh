#!/bin/bash
set -eu
# This is a backwards compatibility script. All logic has moved to '@aws-cdk-testing/cli-integ'
# and should be called from there directly.

exec ${INTEG_TOOLS}/bin/run-suite --use-cli-release=$VERSION uberpackage
