#!/bin/bash
set -eu
distdir="$PWD/dist"
# Get version and changelog file name (these require that .versionrc.json would have been generated)
version=$(node -p "require('./scripts/resolve-version').version")
changelog_file=$(node -p "require('./scripts/resolve-version').changelogFile")
marker=$(node -p "require('./scripts/resolve-version').marker")

rm -fr "${distdir}"
mkdir -p "${distdir}"

#
# Finally rsync all 'dist' directories together into a global 'dist' directory
for dir in $(find packages -name dist | grep -v node_modules | grep -v run-wrappers); do
  echo "Merging ${dir} into ${distdir}" >&2
  rsync -a "$dir/" "${distdir}/"
done
#
# Record the dependency order of NPM packages into a file
# (This file will be opportunistically used during publishing)
#
# Manually sort 'aws-cdk' to the end, as the 'cdk init' command has implicit dependencies
# on other packages (that should not appear in 'package.json' and so
# there is no way to tell lerna about these).
for dir in $(lerna ls --toposort -p | grep -v packages/aws-cdk) $PWD/packages/aws-cdk; do
  (cd "$dir/dist/js" && ls >> "${distdir}/js/npm-publish-order.txt") || true
done

# Remove a JSII aggregate POM that may have snuk past
rm -rf dist/java/software/amazon/jsii

# Get commit from CodePipeline (or git, if we are in CodeBuild)
# If CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local
# build or CodePipeline build), use the HEAD commit hash).
commit="${CODEBUILD_RESOLVED_SOURCE_VERSION:-}"
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > "${distdir}/build.json" <<HERE
{
  "name": "aws-cdk",
  "version": "${version}",
  "commit": "${commit}"
}
HERE

# copy CHANGELOG.md and RELEASE_NOTES.md to dist/ for github releases
cp "${changelog_file}" "${distdir}/CHANGELOG.md"
# Release notes are not available for bump candidate builds.
if ! ${BUMP_CANDIDATE:-false}; then
  cp RELEASE_NOTES.md "${distdir}/RELEASE_NOTES.md"
fi

# defensive: make sure our artifacts don't use the version marker (this means
# that "pack" will always fails when building in a dev environment)
# when we get to 10.0.0, we can fix this...
if find dist/ | grep -F "${marker}"; then
  echo "ERROR: build artifacts use the version marker '${marker}' instead of a real version."
  echo "This is expected for builds in a development environment but should not happen in CI builds!"
  exit 1
fi

# for posterity, print all files in dist
echo "=============================================================================================="
echo " dist contents"
echo "=============================================================================================="
find dist/
