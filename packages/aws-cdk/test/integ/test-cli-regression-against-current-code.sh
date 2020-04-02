#!/bin/bash
# 
# Run our integration tests in regression mode against the 
# local code of the framework and CLI.
# 
#   1. Download the latest released version of the aws-cdk repo.
#   2. Copy its integration tests directory ((test/integ/cli)) here.
#   3. Run the integration tests from the copied directory.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

temp_dir=$(mktemp -d)

function cleanup {
    rm -rf ${temp_dir}
    rm -rf ${integ_under_test}
}

function get_latest_published_version {

    github_headers=""
    if [[ "${GITHUB_TOKEN:-}" != "" ]]; then
        github_headers="Authorization: token ${GITHUB_TOKEN}"
    fi

    out="${temp_dir}/aws-cdk-release.json"

    curl -Ss --dump-header /dev/null -H "$github_headers" https://api.github.com/repos/aws/aws-cdk/releases/latest > ${out}
    latest_version=$(node -p "require('${out}').name")
    echo ${latest_version}
}

function download_repo {

    version=$1

    out="${temp_dir}/.repo.tar.gz"

    curl -L -o ${out} "https://github.com/aws/aws-cdk/archive/${version}.tar.gz"
    tar --strip-components=1 -zxf ${out} -C ${temp_dir}
    echo ${temp_dir}

}

VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-$(get_latest_published_version)}

trap cleanup INT EXIT

echo "Downloading aws-cdk repo version ${VERSION_UNDER_TEST}"
temp_repo_dir="$(download_repo ${VERSION_UNDER_TEST})"

# remove '/' that is prevelant in our branch names but causes
# bad behvaior when using it as directory names.
sanitized_version=$(sed 's/\//-/g' <<< "${VERSION_UNDER_TEST}")

integ_under_test=${integdir}/cli-backwards-tests-${sanitized_version}
rm -rf ${integ_under_test}
echo "Copying integration tests of version ${VERSION_UNDER_TEST} to ${integ_under_test} (dont worry, its gitignored)"
cp -r ${temp_dir}/packages/aws-cdk/test/integ/cli ${integ_under_test}

echo "Running integration tests of version ${VERSION_UNDER_TEST} from ${integ_under_test}"
VERSION_UNDER_TEST=${VERSION_UNDER_TEST} ${integ_under_test}/test.sh