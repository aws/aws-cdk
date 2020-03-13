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

trap cleanup INT EXIT

curl -Ss https://api.github.com/repos/aws/aws-cdk/releases/latest > release.json
latest_version=$(node -p "require('./release.json').name")

echo "Checking out latest version"
pushd ${repo_root} git checkout ${latest_version} -- test/integ/cli && popd

# ${integdir}/cli/test.sh
