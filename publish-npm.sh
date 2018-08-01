#!/bin/bash
set -euo pipefail

###
# Usage: ./publish.sh <release-zip>
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

PKG_VERSION=$(cat ${WORK_DIR}/.version)

#######
# NPM #
#######

echo "📦 Publishing to NPM"
REGISTRY='https://registry.npmjs.org/'
OLD_REGISTRY=$(npm config get registry)
if [ ${OLD_REGISTRY} != ${REGISTRY} ]; then
    echo "👉 Switching to NPM registry ${REGISTRY}"
    npm config set registry ${REGISTRY}
    CLEANUP+=("echo '👈 Resetting NPM registry to ${OLD_REGISTRY}'" "npm config set registry ${OLD_REGISTRY}")
fi
OLD_SCOPE_REGISTRY=$(npm config get @aws-cdk:registry)
if [ ${OLD_SCOPE_REGISTRY} != ${REGISTRY} ]; then
    echo "👉 Switching to NPM registry ${REGISTRY} for @aws-cdk scope"
    npm config set @aws-cdk:registry ${REGISTRY}
    CLEANUP+=("echo '👈 Resetting NPM registry to ${OLD_SCOPE_REGISTRY} for @aws-cdk scope'" "npm config set @aws-cdk:registry ${OLD_SCOPE_REGISTRY}")
fi

TOKENS=$(npm token list 2>&1 || echo '')
if echo ${TOKENS} | grep 'EAUTHUNKNOWN' > /dev/null; then
    echo "🔑 Can't list tokens - apparently missing authentication info"
    npm login
fi

for TGZ in $(find ${WORK_DIR}/y/npm -iname '*.tgz'); do
    npm publish $TGZ --access=public
done

echo "✅ All OK!"
