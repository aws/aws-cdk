#!/bin/bash

###
# Updates the AWS CloudFormation Resource Specification using the files published on the AWS Documentaiton.
# See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
###

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

rm -f CHANGELOG.md.new

function update-spec() {
    local title=$1
    local url=$2
    local target=$3
    local gunzip=$4

    local intermediate="$(mktemp -d)/new.json"

    # fail if the spec has changes, otherwise we won't be able to determine the diff
    if [ -n "$(git status --porcelain ${target})" ]; then
        echo "The file ${target} has changes, revert them before cfn-update"
        exit 1
    fi

    echo >&2 "Downloading from ${url}..."
    if ${gunzip}; then
        curl -sL "${url}" | gunzip - > ${intermediate}
    else
        curl -sL "${url}" > ${intermediate}
    fi

    echo >&2 "Sorting..."
    sort-json ${intermediate}

    echo >&2 "Updating CHANGELOG.md..."
    node build-tools/spec-diff.js "${title}" "${target}" "${intermediate}" >> CHANGELOG.md.new
    echo "" >> CHANGELOG.md.new

    echo >&2 "Updating source spec..."
    rm -f ${target}
    cp ${intermediate} ${target}
}

update-spec \
    "CloudFormation Resource Specification" \
    "https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json" \
    spec-source/000_CloudFormationResourceSpecification.json \
    true

echo >&2 "Recording new version..."
rm -f cfn.version
node -p "require('${scriptdir}/../spec-source/000_CloudFormationResourceSpecification.json').ResourceSpecificationVersion" > cfn.version

update-spec \
    "Serverless Application Model (SAM) Resource Specification" \
    "https://raw.githubusercontent.com/awslabs/goformation/master/generate/sam-2016-10-31.json" \
    spec-source/000_sam.spec.json \
    false

npm run build

echo >&2 "Creating missing AWS construct libraries for new resource types..."
node ${scriptdir}/create-missing-libraries.js || {
    echo "------------------------------------------------------------------------------------"
    echo "cfn-spec update script failed when trying to create modules for new services"
    echo "Fix the error (you will likely need to add RefKind patches), and then run 'npm run update' again"
    exit 1
}

# update decdk dep list
(cd ${scriptdir}/../../../decdk && node ./deps.js || true)
(cd ${scriptdir}/../../../monocdk-experiment && yarn gen || true)

# append old changelog after new and replace as the last step because otherwise we will not be idempotent
_changelog_contents=$(cat CHANGELOG.md.new)
if [ -n "${_changelog_contents}" ]; then
    cat CHANGELOG.md >> CHANGELOG.md.new
    cp CHANGELOG.md.new CHANGELOG.md
fi
