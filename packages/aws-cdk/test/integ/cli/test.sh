#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header CLI Integration Tests

prepare_fixture

current_version=$(node -p "require('${scriptdir}/../../../package.json').version")

# This allows injecting different versions, not just the current one.
# Useful when testing.
VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-${current_version}}

# check if a specific test should be skiped
# from execution in the current version.
function should_skip {
  test=$1
  echo $(node -p "require('${scriptdir}/../cli.exclusions.js').shouldSkip('${test}', '${VERSION_UNDER_TEST}')")
}

# get the justification for why a test is skipped.
# this will fail if there is no justification!
function get_skip_jusitification {
  test=$1
  echo $(node -p "require('${scriptdir}/../cli.exclusions.js').getJustification('${test}', '${VERSION_UNDER_TEST}')")
}

for test in $(cd ${scriptdir} && ls test-*.sh); do
  echo "============================================================================================"

  # first check this if this test should be skipped.
  # this can happen when running in regression mode 
  # when we introduce an intentional breaking change.
  skip=$(should_skip ${test})

  if [ ${skip} == "true" ]; then

    # make sure we have a justification, this will fail if not.
    jusitification="$(get_skip_jusitification ${test})"

    # skip this specific test.
    echo "${test} - skipped (${jusitification})"
    continue
  fi

  echo "${test}"
  echo "============================================================================================"
  /bin/bash ${scriptdir}/${test}
done

