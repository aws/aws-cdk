#!/bin/bash
# Naming shim for backwards compatibility with legacy
# tests and canaries.
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
init_test_dir=/tmp/cdkInitTest
source $scriptdir/test-python.sh
