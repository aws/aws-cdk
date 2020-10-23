#!/bin/bash
#
# Run our integration tests in regression mode against the
# candidate version of the framework, which is the one we just packed.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

source ${integdir}/test-cli-regression.bash

run_regression_against_framework_version CANDIDATE_VERSION
