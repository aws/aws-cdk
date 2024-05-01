#!/bin/bash
#
# Run our integration tests in regression mode against the
# previous version of the framework, relative to the version being packed now.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

source ${integdir}/test-cli-regression.bash

run_regression_against_framework_version PREVIOUS_VERSION
