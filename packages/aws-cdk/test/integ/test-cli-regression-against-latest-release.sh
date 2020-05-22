#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

# run the regular regression test but pass the env variable that will
# eventually instruct our runners and wrappers to install the framework
# from npmjs.org rather then using the local code.
#
# This has the effect of testing the old (published) framework against
# the new (candidate) CLI using the old (published) tests.
#
# We have to use the magic `USE_PUBLISHED_FRAMEWORK_VERSION` variable, because
# simply using a simple version number wouldn't suffice to distinguish between
# 'candidate' and 'latest': candidate releases being tested on our `master`
# branch have the same version as the latest release!
USE_PUBLISHED_FRAMEWORK_VERSION=True ${integdir}/test-cli-regression-against-current-code.sh
