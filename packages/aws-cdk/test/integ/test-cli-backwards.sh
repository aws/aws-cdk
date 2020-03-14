#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)
repo_root=$(realpath ${integdir}/../../../../)

function cleanup {
    rm -rf release.json
    pushd ${repo_root}
    git reset packages/aws-cdk/test/integ/cli/.
    git checkout HEAD -- packages/aws-cdk/test/integ/cli/.
    popd
}

function download_latest_release_json {

    github_headers=""
    if [[ "${GITHUB_TOKEN:-}" != "" ]]; then
        github_headers="Authorization: token ${GITHUB_TOKEN}"
    fi

    curl -Ss --dump-header headers.txt -H "$github_headers" https://api.github.com/repos/aws/aws-cdk/releases/latest > release.json
}

trap cleanup INT EXIT

download_latest_release_json
latest_version=$(node -p "require('./release.json').name")

echo "Checking out integration tests from version ${latest_version}"
pushd ${repo_root} git checkout ${latest_version} -- test/integ/cli && popd

echo "Running integration tests from version ${latest_version}"
# ${integdir}/cli/test.sh
