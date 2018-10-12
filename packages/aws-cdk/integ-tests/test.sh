#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

toolkit_bin="${scriptdir}/../bin"

if [ ! -x ${toolkit_bin}/cdk ]; then
  echo "Unable to find 'cdk' under ${toolkit_bin}"
  exit 1
fi

# make sure "this" toolkit is in the path
export PATH=${toolkit_bin}:$PATH

cd ${scriptdir}
for test in test-*.sh; do
  echo "============================================================================================"
  echo "${test}"
  echo "============================================================================================"
  /bin/bash ${test}
done
