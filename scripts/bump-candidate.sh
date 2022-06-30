#!/bin/bash
# --------------------------------------------------------------------------------------------------
#
# This script is intended to be used in our main pipeline as a way of incrementing the version number
# so that it doesn't collide with any published version. This is needed because our integration tests launch
# a verdaccio instance that serves local tarballs, and if those tarballs have the same version as
# already published modules, it messes things up.
#
# It does so by using a pre-release "rc" tag, making it so that locally packed versions will always be
# suffixed with '-rc', distinguishing it from published modules.
#
# If you need to run integration tests locally against the distribution tarballs, you should run this
# script locally as well before building and packing the repository.
#
# This script only increments the version number in the version files, it does not generate a changelog.
#
# --------------------------------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
rootdir=${scriptdir}/..
BUMP_CANDIDATE=true ${rootdir}/bump.sh ${1:-minor}
