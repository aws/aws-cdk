#!/bin/bash
set -euo pipefail

###
# Usage: ./publish-docs.sh <release-zip>
#
# Publishes the content of a release bundle ZIP file to the standard package
# repositories for the various supported languages:
# * Javascript & TypeScript: NPM
# * Documentation: GitHub Pages
# * (More to come later)
###

if [ $# -ne 1 ]; then
    echo "Missing release zip file argument"
    echo "Usage: ./publish.sh <release-zip>"
    exit 1
fi

RELEASE_BUNDLE=$1
if [ ! -f ${RELEASE_BUNDLE} ]; then
    echo "${RELEASE_BUNDLE} is not a file!"
    exit 127
fi

###############
# PREPARATION #
###############

declare -a CLEANUP=()
function cleanup() {
    for ((i = 0; i < ${#CLEANUP[@]}; i++ ))
    do
        eval "${CLEANUP[$i]}"
    done
    echo '🍻 Done!'
}
trap cleanup 'EXIT'


WORK_DIR=$(mktemp -d)
CLEANUP+=("echo '🚮 Cleaning up working directory'" "rm -fr ${WORK_DIR}")
echo "💼 Working directory: ${WORK_DIR}"

echo "🗜 Unzipping release bundle (be patient - this may take a while)"
unzip -q ${RELEASE_BUNDLE} -d ${WORK_DIR}

PKG_VERSION=$(cat ${WORK_DIR}/.version | cut -d"+" -f1)

################
# GitHub Pages #
################

echo "📖 Publishing to GitHub Pages"

GIT_REPO=$(mktemp -d)
CLEANUP+=("echo '🚮 Cleaning up GitHub Pages working copy'" "rm -fr ${GIT_REPO}")

git clone -b gh-pages --depth=1 git@github.com:awslabs/aws-cdk ${GIT_REPO}
mkdir -p ${GIT_REPO}/versions

rsync -ar --delete --exclude=/.git --exclude=/versions ${WORK_DIR}/docs/ ${GIT_REPO}/
rsync -ar --delete ${WORK_DIR}/docs/ ${GIT_REPO}/versions/${PKG_VERSION}/

(
    cd ${GIT_REPO}
    git add .
    git commit -m "Release ${PKG_VERSION}"
    git push
)

echo "✅ All OK!"
