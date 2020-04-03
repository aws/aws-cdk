#!/bin/bash
# 
# Run both local integration tests and regression tests.
#
set -eu

scriptdir=$(cd $(dirname $0) && pwd)

${scriptdir}/integ-cli-no-regression.sh
${scriptdir}/integ-cli-regression.sh
