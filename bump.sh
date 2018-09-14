#!/bin/bash
set -euo pipefail
ver=${1:-}
if [ -z "${ver}" ]; then
  echo "usage: ./bump.sh <version>"
  exit 1
fi

lerna publish --force-publish=* --skip-npm --skip-git --repo-version ${ver}

# Update CHANGELOG.md only at the root
cat > /tmp/context.json <<HERE
{
  "version": "${ver}"
}
HERE

conventional-changelog -p angular -i CHANGELOG.md -s --context /tmp/context.json

