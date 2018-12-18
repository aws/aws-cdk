#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

cd ${scriptdir}
for test in test-*.sh; do
  echo "============================================================================================"
  echo "${test}"
  echo "============================================================================================"
  /bin/bash ${test}
done
