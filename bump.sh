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

# /bin/bash ./install.sh

# Generate CHANGELOG and create a commit
# --skip.tag because we create the tag as part of creating the github release
npx standard-version \
  --bumpFiles package.json \
  --release-as ${version} \
  --skip.tag=true \
  --releaseCommitMessageFormat="chore(release): v{{currentTag}}" \
  --commit-all

