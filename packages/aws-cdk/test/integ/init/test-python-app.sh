#!/bin/bash
# Naming shim for backwards compatibility with legacy
# tests and canaries.
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
exec $scriptdir/test-python.sh
