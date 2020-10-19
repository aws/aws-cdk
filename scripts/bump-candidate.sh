#!/bin/bash
# --------------------------------------------------------------------------------------------------
#
# This script is intended to be used in our master pipeline as a way of incrementing the version number
# so that it doesnt colide with any published version. This is needed because our integration tests launch
# a verdaccio instance that serves local tarballs, and if those tarballs have the same version as
# already published modules, it messes things up.
#
# It does so by using a pre-release rc tag, making it so that locally packed versions will always be
# suffixed with '-rc', distinguishing it from publisehd modules.
#
# If you need to run integration tests locally against the distribution tarballs, you should run this
# script locally as well before building and packing the repository.
#
# This script only increments the version number in the version files, it does not generate a changelog.
#
# --------------------------------------------------------------------------------------------------
set -euo pipefail
version=${1:-minor}

echo "Starting candidate ${version} version bump"

npx standard-version --release-as ${version} --prerelease=rc --skip.commit --skip.changelog
