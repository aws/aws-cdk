#!/bin/bash

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

npm run integ
