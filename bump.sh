#!/bin/bash
set -euo pipefail
ver=${1:-}
if [ -z "${ver}" ]; then
  echo "usage: ./bump.sh <version>"
  exit 1
fi

export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

/bin/bash ./install.sh

npx lerna version --force-publish=* --no-git-tag-version --no-push ${ver}

# Update CHANGELOG.md only at the root
cat > /tmp/context.json <<HERE
{
  "version": "${ver}"
}
HERE

./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s --context /tmp/context.json

# align "peerDependencies" to actual dependencies after bump
# this is technically only required for major version bumps, but in the meantime we shall do it in every bump
/bin/bash scripts/fix-peer-deps.sh

