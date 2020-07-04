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

function fetch_integration_tests() {

  version=$1

  temp_dir=$(mktemp -d)
  integ_under_test=${integdir}/cli-backwards-tests-${version}

  pushd ${temp_dir}

  echo "Downloading aws-cdk ${version} tarball from npm"
  npm pack aws-cdk@${version}
  tar -zxvf aws-cdk-${version}.tgz

  rm -rf ${integ_under_test}

  echo "Copying integration tests of version ${version} to ${integ_under_test} (dont worry, its gitignored)"
  cp -r ${temp_dir}/package/test/integ/cli "${integ_under_test}"

  patch_dir="${integdir}/cli-regression-patches/${version}"
  if [[ -d "$patch_dir" ]]; then
      echo "Hotpatching the tests with files from $patch_dir" >&2
      cp -r "$patch_dir"/* ${integ_under_test}
  fi

  popd


}

TEST_RUNNER=${TEST_RUNNER:-""}

if [ "${TEST_RUNNER}" != "dist" ]; then
  echo "Unsupported runner: ${TEST_RUNNER}. Regression tests can only run with the 'dist' runner"
  exit 1
fi

CANDIDATE_VERSION=${CANDIDATE_VERSION:?"Need to set CANDIDATE_VERSION"}
SUPPLANT_VERSION=$(node helpers.js fetchSupplantVersion ${CANDIDATE_VERSION})

function run() {
  framework_version=$1

  integ_under_test=$(fetch_integration_tests ${SUPPLANT_VERSION})

  NPM_INSTALL_PACKAGE_SUFFIX=@${framework_version} ${integ_under_test}/test.sh "$@"
}
