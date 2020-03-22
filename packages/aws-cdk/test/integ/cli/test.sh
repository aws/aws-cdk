#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header CLI Integration Tests

prepare_fixture

current_version=$(node -p "require('${scriptdir}/../../../package.json').version")

VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-${current_version}}

function should_skip {
  test=$1
  echo $(node -p "require('${scriptdir}/../cli.exclusions.js').shouldSkip('${test}', '${VERSION_UNDER_TEST}')")
}

function get_skip_jusitification {
  test=$1
  echo $(node -p "require('${scriptdir}/../cli.exclusions.js').getJustification('${test}', '${VERSION_UNDER_TEST}')")
}

for test in $(cd ${scriptdir} && ls test-*.sh); do
  echo "============================================================================================"

  skip=$(should_skip ${test})

  if [ ${skip} == "true" ]; then

    jusitification="$(get_skip_jusitification ${test})"

    echo "${test} - skipped (${jusitification})"
    continue
  fi

  echo "${test}"
  echo "============================================================================================"
  # /bin/bash ${scriptdir}/${test}
done

