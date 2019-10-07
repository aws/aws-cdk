#!/bin/bash
# --------------------------------------------------------------------------------------------------
#
# This script is intended to be used to bump the version of the CDK modules, update package.json,
# package-lock.json, and create a commit.
#
# to start a version bump, run:
#     bump.sh <version | version Type>
#
# If a version is not provided, the 'minor' version will be bumped.
# The version can be an explicit version _or_ one of:
# 'major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', or 'prerelease'.
#
# --------------------------------------------------------------------------------------------------
set -euo pipefail
version=${1:-minor}

echo "Starting ${version} version bump"

export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

/bin/bash ./install.sh

npx lerna version ${version} --force-publish=* --no-git-tag-version --no-push

# Another round of install to fix package-lock.jsons
/bin/bash ./install.sh

# align "peerDependencies" to actual dependencies after bump
# this is technically only required for major version bumps, but in the meantime we shall do it in every bump
/bin/bash scripts/fix-peer-deps.sh

# Generate CHANGELOG and create a commit
./node_modules/.bin/standard-version --release --skip.tag=true --commit-all