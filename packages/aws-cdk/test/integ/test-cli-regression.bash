#!/bin/bash
#
# Helper functions for CLI regression tests.
#
set -euo pipefail
integdir=$(cd $(dirname $0) && pwd)

# Run our integration tests in regression mode.
#
#   1. Figure out what was the previous (relative to the current candidate) version we published.
#   2. Download the integration tests artifact from that version.
#   2. Copy its integration tests directory ((test/integ/cli)) here.
#   3. Run the integration tests from the copied directory.
#
# Positional Arugments:
#
#   1) Framework version identifier. Which version of the framework should the tests run against. Options are:
#
#       - CANDIDATE_VERSION: Use the candidate code, i.e the one being built right now.
#       - PREVIOUS_VERSION: Use the previous version code, i.e the published version prior to CANDIDATE_VERSION.
#
function run_regression_against_framework_version() {

  TEST_RUNNER=${TEST_RUNNER:-""}
  CANDIDATE_VERSION=${CANDIDATE_VERSION:-""}

  if [ "${TEST_RUNNER}" != "dist" ]; then
    echo "Unsupported runner: ${TEST_RUNNER}. Regression tests can only run with the 'dist' runner"
    exit 1
  fi

  SUPPORTED_FRAMEWORK_VERSION_IDENTIFIERS=("CANDIDATE_VERSION PREVIOUS_VERSION")
  FRAMEWORK_VERSION_IDENTIFIER=$1
  if [[ ! " ${SUPPORTED_FRAMEWORK_VERSION_IDENTIFIERS[@]} " =~ " ${FRAMEWORK_VERSION_IDENTIFIER} " ]]; then
      echo "Unsupported framework version identifier. Should be one of ${SUPPORTED_FRAMEWORK_VERSION_IDENTIFIERS}"
      exit 1
  fi

  echo "Fetching previous version for candidate: ${CANDIDATE_VERSION}"

  # we need to explicitly install these deps because this script is executed
  # int the test phase, which means the cwd is the packaged dist directory,
  # so it doesn't have the dependencies installed from the installation of the package.json
  # in the build phase. maybe we should just run npm install on the package.json again?
  npm install @octokit/rest@^18.0.6 semver@^7.3.2 make-runnable@^1.3.8
  PREVIOUS_VERSION=$(node ${integdir}/github-helpers.js fetchPreviousVersion ${CANDIDATE_VERSION})

  echo "Previous version is: ${PREVIOUS_VERSION}"

  temp_dir=$(mktemp -d)
  integ_under_test=${integdir}/cli-backwards-tests-${PREVIOUS_VERSION}

  pushd ${temp_dir}

  echo "Downloading aws-cdk ${PREVIOUS_VERSION} tarball from npm"
  npm pack aws-cdk@${PREVIOUS_VERSION}
  tar -zxf aws-cdk-${PREVIOUS_VERSION}.tgz

  rm -rf ${integ_under_test}

  echo "Copying integration tests of version ${PREVIOUS_VERSION} to ${integ_under_test} (dont worry, its gitignored)"
  cp -r ${temp_dir}/package/test/integ/cli "${integ_under_test}"
  cp -r ${temp_dir}/package/test/integ/helpers "${integ_under_test}"

  patch_dir="${integdir}/cli-regression-patches/v${PREVIOUS_VERSION}"
  # delete possibly stale junit.xml file
  rm -f ${integ_under_test}/junit.xml
  if [[ -d "$patch_dir" ]]; then
      echo "Hotpatching the tests with files from $patch_dir" >&2
      cp -r "$patch_dir"/* ${integ_under_test}
  fi

  popd

  # the framework version to use is determined by the caller as the first argument.
  # its a variable name indirection.
  export FRAMEWORK_VERSION=${!FRAMEWORK_VERSION_IDENTIFIER}

  # Show the versions we settled on
  echo "♈️ Regression testing [cli $(cdk --version)] against [framework ${FRAMEWORK_VERSION}] using [tests ${PREVIOUS_VERSION}}]"

  ${integ_under_test}/test.sh
}
