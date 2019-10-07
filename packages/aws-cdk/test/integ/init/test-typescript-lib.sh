#!/bin/bash
# Naming shim for backwards compatibility with legacy
# tests and canaries.
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
# Run only lib template
exec $scriptdir/test-typescript.sh lib
