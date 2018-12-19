#!/bin/bash

###
# Updates the AWS CloudFormation Resource Specification using the files published on the AWS Documentaiton.
# See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
###

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

function update-spec() {
    local title=$1
    local url=$2
    local target=$3
    local gunzip=$4

    local intermediate="$(mktemp -d)/new.json"

    echo >&2 "Downloading from ${url}..."
    if ${gunzip}; then
        curl -sL "${url}" | gunzip - > ${intermediate}
    else
        curl -sL "${url}" > ${intermediate}
    fi

    echo >&2 "Sorting..."
    sort-json ${intermediate}

    echo >&2 "Updaging CHANGELOG.md..."
    touch CHANGELOG.md
    mv CHANGELOG.md CHANGELOG.md.bak
    rm -f CHANGELOG.md
    node build-tools/spec-diff.js "${title}" "${target}" "${intermediate}" > CHANGELOG.md
    echo "" >> CHANGELOG.md
    cat CHANGELOG.md.bak >> CHANGELOG.md
    rm CHANGELOG.md.bak

    echo >&2 "Updarting source spec..."
    rm -f ${target}
    cp ${intermediate} ${target}
}

update-spec \
    "CloudFormation Resource Specification" \
    "https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json" \
    spec-source/000_CloudFormationResourceSpecification.json \
    true

update-spec \
    "Serverless Application Model (SAM) Resource Specification" \
    "https://raw.githubusercontent.com/awslabs/goformation/master/generate/sam-2016-10-31.json" \
    spec-source/000_sam.spec.json \
    false

echo >&2 "Creating missing AWS construct libraries for new resource types..."
node ${scriptdir}/create-missing-libraries.js

