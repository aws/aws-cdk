#!/bin/bash
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

temp_dir=$(mktemp -d)

function cleanup {
    rm -rf ${temp_dir}
    # rm -rf ${integdir}/cli-${latest_version}
}

function download_latest_release_json {

    github_headers=""
    if [[ "${GITHUB_TOKEN:-}" != "" ]]; then
        github_headers="Authorization: token ${GITHUB_TOKEN}"
    fi

    out="${temp_dir}/aws-cdk-release.json"

    curl -Ss --dump-header /dev/null -H "$github_headers" https://api.github.com/repos/aws/aws-cdk/releases/latest > ${out}
    echo ${out}
}

function download_repo {

    version=$1

    out="${temp_dir}/aws-cdk-${version}.tar.gz"

    curl -L -o ${out} "https://github.com/aws/aws-cdk/archive/${version}.tar.gz"
    tar --strip-components=1 -zxf ${out} -C ${temp_dir}
    echo ${temp_dir}

}

# trap cleanup INT EXIT

temp_release_json=$(download_latest_release_json)
latest_version=$(node -p "require('${temp_release_json}').name")

echo "Downloading aws-cdk repo version ${latest_version}"
temp_repo_dir="$(download_repo ${latest_version})"
cp -r ${temp_dir}/packages/aws-cdk/test/integ/cli ${integdir}/cli-${latest_version}

echo "Running integration tests from version ${latest_version}"
# VERSION_UNDER_TEST=${latest_version} ${integdir}/cli-${latest_version}/test.sh