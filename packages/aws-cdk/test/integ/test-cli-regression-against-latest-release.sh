#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

# run the regular regression test but pass the env variable that will
# eventually instruct our runners and wrappers to install the framework
# from npmjs.org rather then using the local code.
USE_PUBLISHED_FRAMEWORK_VERSION=True ${integdir}/test-cli-regression-against-current-code.sh "$@"
