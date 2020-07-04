#!/bin/bash
#
# Run our integration tests in regression mode.
#
#   1. Figure out what was the previous (relative to the current candidate) version we published.
#   2. Download the integration tests artifact from that version.
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

function run() {

  if [ "${TEST_RUNNER:-""}" != "dist" ]; then
    echo "Unsupported runner: ${TEST_RUNNER}. Regression tests can only run with the 'dist' runner"
    exit 1
  fi

  CANDIDATE_VERSION=${CANDIDATE_VERSION:?"Need to set CANDIDATE_VERSION"}
  SUPPLANT_VERSION=$(node helpers.js fetchSupplantVersion ${CANDIDATE_VERSION})

  new_framework=$1

  if [ ${new_framework} == true ]; then
    framework_version=${CANDIDATE_VERSION}
  else
    framework_version=${SUPPLANT_VERSION}
  fi


  integ_under_test=$(fetch_integration_tests ${SUPPLANT_VERSION})

  NPM_INSTALL_PACKAGE_SUFFIX=@${framework_version} ${integ_under_test}/test.sh "$@"
}

function run_new_framework() {
  run true
}

function run old_framework() {
  run false
}
