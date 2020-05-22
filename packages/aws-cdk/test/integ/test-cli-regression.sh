#!/bin/bash
#
# This script will run the OLD tests against the NEW CLI, using either the OLD
# or the NEW framework.
#
# Because the OLD and the NEW framework have the same version number, we can't
# use the version number to distinguish between them. However, we know that
# OLD will *always* come from the packages that have already been released to
# a package manager.
#
# How we'll therefore make the difference between them is by installing the
# framework packages either INSIDE the test runner (thereby installing the
# NEW packages) or OUTSIDE the test runner (thereby installing the OLD
# packages).
#
# The tests will always come from the package manager, and the CLI will
# always come from the candidate release.
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
