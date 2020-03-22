#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header CLI Integration Tests

prepare_fixture

VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-1.30.0}

function get_skip_jusitification {
  test=$1
  version=$2
  echo $(node -p "require('../cli.exclusions.js').forTest(${test}, ${VERSION_UNDER_TEST}).justification")
}

for test in $(cd ${scriptdir} && ls test-*.sh); do
  echo "============================================================================================"

  skip_jusitification=$(get_skip_jusitification ${test})

  if [ ${skip_jusitification} != "undefined" ]; then
    echo ${test} - skipped (${skip_jusitification})
    continue
  fi

  echo "${test}"
  echo "============================================================================================"
  # /bin/bash ${scriptdir}/${test}
done

