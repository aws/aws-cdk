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
prerelease_tag=${2:-rc}

echo "Starting ${version} version bump"

# /bin/bash ./install.sh

args="--release-as ${version}"

if [ ! -z ${prerelease_tag} ]; then
  args="${args} --prerelease=${prerelease_tag}"
fi

# Generate CHANGELOG and create a commit (see .versionrc.json)
npx standard-version ${args}
