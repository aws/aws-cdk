#!/bin/bash
#
# Run our integration tests in regression mode against the
# supplant version of the framework, which is the previous one we published.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

source ${integdir}/test-cli-regression.bash

run_old_framework
