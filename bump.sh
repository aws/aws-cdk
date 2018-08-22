#!/bin/bash
set -euo pipefail
ver=${1:-}
if [ -z "${ver}" ]; then
  echo "usage: ./bump.sh <version>"
  exit 1
fi

lerna publish --force-publish=* --skip-npm --skip-git --repo-version ${ver}
lerna run build

# update test expectations
UPDATE_DIFF=1 lerna run test

