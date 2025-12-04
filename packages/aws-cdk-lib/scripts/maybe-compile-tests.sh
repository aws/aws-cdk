#!/bin/bash
set -eu
# Compile tests if we're running in CI
if ${CI:-false}; then
    npx tsc -b tsconfig.tests.json
fi
