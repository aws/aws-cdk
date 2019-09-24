#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header CLI Integration Tests

prepare_fixture

for test in $(cd ${scriptdir} && ls test-*.sh); do
  echo "============================================================================================"
  echo "${test}"
  echo "============================================================================================"
  /bin/bash ${scriptdir}/${test}
done
