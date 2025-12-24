#!/bin/bash
set -eu

ci=false
case "${CI:-false}" in
    "1" | "true" | "yes") ci=true;;
esac


# Compile tests if we're running in CI
if ${ci}; then
    npx tsc -b tsconfig.json
fi
