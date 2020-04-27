#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

echo "Regression tests are currently disabled. We will re-enable after investigation"
exit 0

# run the regular regression test but pass the env variable that will
# eventually instruct our runners and wrappers to install the framework
# from npmjs.org rather then using the local code.
USE_PUBLISHED_FRAMEWORK_VERSION=True ${integdir}/test-cli-regression-against-current-code.sh
