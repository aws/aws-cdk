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

function run() {

  CANDIDATE_VERSION=${CANDIDATE_VERSION:?"Need to set CANDIDATE_VERSION"}

  echo "Fetching supplant version for candidate: ${CANDIDATE_VERSION}"
  SUPPLANT_VERSION=$(node ${integdir}/helpers.js fetchSupplantVersion ${CANDIDATE_VERSION})

  echo "Supplant version is: ${SUPPLANT_VERSION}"

  new_framework=$1

  if [ ${new_framework} == true ]; then
    framework_version=${CANDIDATE_VERSION}
  else
    framework_version=${SUPPLANT_VERSION}
  fi

  temp_dir=$(mktemp -d)
  integ_under_test=${integdir}/cli-backwards-tests-${SUPPLANT_VERSION}

  pushd ${temp_dir}

  echo "Downloading aws-cdk ${SUPPLANT_VERSION} tarball from npm"
  npm pack aws-cdk@${SUPPLANT_VERSION}
  tar -zxvf aws-cdk-${SUPPLANT_VERSION}.tgz

  rm -rf ${integ_under_test}

  echo "Copying integration tests of version ${SUPPLANT_VERSION} to ${integ_under_test} (dont worry, its gitignored)"
  cp -r ${temp_dir}/package/test/integ/cli "${integ_under_test}"

  patch_dir="${integdir}/cli-regression-patches/v${SUPPLANT_VERSION}"
  # delete possibly stale junit.xml file
  rm -f ${integ_under_test}/junit.xml
  if [[ -d "$patch_dir" ]]; then
      echo "Hotpatching the tests with files from $patch_dir" >&2
      cp -r "$patch_dir"/* ${integ_under_test}
  fi

  popd

  # this is appended to the modules upon installation in the tests.
  # see cdk-helpers.ts#withCdkApp
  FRAMEWORK_VERSION=${framework_version} ${integ_under_test}/test.sh "$@"
}

function run_new_framework() {
  run true
}

function run_old_framework() {
  run false
}
