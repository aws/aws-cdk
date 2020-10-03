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
    # keep junit file to allow report creation
    cp ${integ_under_test}/coverage/junit.xml .
    rm -rf ${temp_dir}
    rm -rf ${integ_under_test}
}


function get_latest_published_version {

    # fetch the latest published version number.
    # this is stored in the github releases under the 'latest' tag.

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

    # we need to download the repo code from GitHub in order to extract
    # the integration tests that were present in that version of the repo.
    #
    # Download just the CLI tarball, which contains the tests. We can't
    # use 'npm pack' here to obtain the tarball, as 'npm' commands may
    # be redirected to a local Verdaccio.
    #
    # Rather than introducing another level of indirection to work around
    # that, just go to npmjs.com directly.

    # Strip off leading 'v'
    version=${1#v}

    out="${temp_dir}/.repo.tar.gz"

    curl -Ssf -L -o ${out} "https://registry.npmjs.org/aws-cdk/-/aws-cdk-${version}.tgz"
    tar -zxf ${out} -C ${temp_dir}
}

# this allows injecting different versions to be treated as the baseline
# of the regression. usually this would just be the latest published version,
# but this can even be a branch name during development and testing.
VERSION_UNDER_TEST=${VERSION_UNDER_TEST:-$(get_latest_published_version)}

trap cleanup INT EXIT

echo "Downloading aws-cdk repo version ${VERSION_UNDER_TEST}"
download_repo ${VERSION_UNDER_TEST}

# remove '/' that is prevelant in our branch names but causes
# bad behvaior when using it as directory names.
sanitized_version=$(sed 's/\//-/g' <<< "${VERSION_UNDER_TEST}")

# Test must be created in the same directory here because the script files liberally
# include files from '..' and they have to exist.
integ_under_test=${integdir}/cli-backwards-tests-${sanitized_version}
rm -rf ${integ_under_test}
echo "Copying integration tests of version ${VERSION_UNDER_TEST} to ${integ_under_test} (dont worry, its gitignored)"
cp -r ${temp_dir}/package/test/integ/cli ${integ_under_test}

patch_dir="${integdir}/cli-regression-patches/${VERSION_UNDER_TEST}"
# delete possibly stale junit.xml file
rm -f ${integ_under_test}/junit.xml
if [[ -d "$patch_dir" ]]; then
    echo "Hotpatching the tests with files from $patch_dir" >&2
    cp -r "$patch_dir"/* ${integ_under_test}
fi

echo "Running integration tests of version ${VERSION_UNDER_TEST} from ${integ_under_test}"
set -x

VERSION_UNDER_TEST=${VERSION_UNDER_TEST} ${integ_under_test}/test.sh "$@"
