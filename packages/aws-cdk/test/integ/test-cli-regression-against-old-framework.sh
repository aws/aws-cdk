#!/bin/bash
#
# Run our integration tests in regression mode against the
# local code of the framework and CLI.
#
#   1. Download the latest released version of the aws-cdk repo.
#   2. Copy its integration tests directory ((test/integ/cli)) here.
#   3. Run the integration tests from the copied directory.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

source ${integdir}/helpers.bash

run_regression ${SUPPLANT_VERSION}
