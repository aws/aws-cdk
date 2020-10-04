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
prerelease_tag=${2:-}
commit=${3:-"true"}

echo "Starting ${version} version bump"

# /bin/bash ./install.sh

args="--release-as ${version}"

if [ ! -z ${prerelease_tag} ]; then
  args="${args} --prerelease=${prerelease_tag}"
fi

if [ ${commit} = "false" ]; then
  args="${args} --skip.commit"
fi

# Generate CHANGELOG and create a commit (see .versionrc.json)
npx standard-version ${args}

if [ ${commit} = "true" ]; then
  # I am sorry.
  #
  # I've gone diving through the code of `conventional-changelog` to see if there
  # was a way to configure the string and ultimately I decided that a 'sed' was the simpler
  # way to go.
  sed -i.tmp -e 's/BREAKING CHANGES$/BREAKING CHANGES TO EXPERIMENTAL FEATURES/' CHANGELOG.md
  rm CHANGELOG.md.tmp
  git add CHANGELOG.md
  git commit --amend --no-edit
fi
