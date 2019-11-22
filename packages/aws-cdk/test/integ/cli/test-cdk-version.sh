#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

cdk version > v1.txt
cdk --version > v2.txt

assert_diff "version" v1.txt v2.txt

echo "✅  success"
