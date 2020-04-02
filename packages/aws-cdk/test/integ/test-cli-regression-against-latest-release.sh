#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)
USE_PUBLISHED_FRAMEWORK_VERSION=True ${integdir}/test-cli-regression-against-current-code.sh
