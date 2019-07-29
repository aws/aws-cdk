set -eu
scriptdir=$(cd $(dirname $0) && pwd)
source $scriptdir/../common/util.bash

CDK_REPO="${CDK_REPO:-}"

# If CDK_REPO is set to point to the root of the CDK source repository
# the CLI and modules will be taken from there. Otherwise, we will honor
# the usual IS_CANARY flag for integration test-vs-canary mode switch.
if [ -z "${CDK_REPO}" -a -z "${TESTS_PREPARED:-}" ]; then
    prepare_toolkit
    preload_npm_packages

    # Only do this once
    export TESTS_PREPARED=1
fi

if [[ "${CDK_REPO}" != "" ]]; then
    export CDK_REPO=$(cd $CDK_REPO && pwd)
    alias cdk=$CDK_REPO/packages/aws-cdk/bin/cdk
fi

if [[ -z "${CREDS_SET:-}" ]]; then
    # Check that credentials are configured
    aws sts get-caller-identity > /dev/null
    export CREDS_SET=1
fi

cd ${scriptdir}

if ${IS_CANARY:-false}; then
  export STACK_NAME_PREFIX=cdk-toolkit-canary
else
  export STACK_NAME_PREFIX=cdk-toolkit-integration
fi

function cleanup_stack() {
  local stack_arn=$1
  echo "| ensuring ${stack_arn} is cleaned up"
  if aws cloudformation describe-stacks --stack-name ${stack_arn} 2> /dev/null; then
    aws cloudformation delete-stack --stack-name ${stack_arn}
  fi
}

function cleanup() {
  cleanup_stack ${STACK_NAME_PREFIX}-test-1
  cleanup_stack ${STACK_NAME_PREFIX}-test-2
  cleanup_stack ${STACK_NAME_PREFIX}-iam-test
}

function install_dep() {
  local dep=$1

  if [ -n "${CDK_REPO}" ]; then
    mkdir -p node_modules/@aws-cdk
    local source="${CDK_REPO}/packages/${dep}"
    local target="$PWD/node_modules/${dep}"
    echo "| symlinking dependency ${target} => ${source}"
    ln -s ${source} ${target}
  else
    echo "| installing dependency ${dep}"
    npm i --no-save ${dep}
  fi
}

function setup() {
  cleanup
  rm -rf /tmp/cdk-integ-test
  mkdir -p /tmp/cdk-integ-test
  cp -R app/* /tmp/cdk-integ-test
  cd /tmp/cdk-integ-test

  if [ -n "${CDK_REPO}" ]; then
    local cdk_bin="${CDK_REPO}/packages/aws-cdk/bin"
    echo "| adding ${cdk_bin} to PATH"
    export PATH=${cdk_bin}:$PATH
  fi

  install_dep @aws-cdk/core
  install_dep @aws-cdk/aws-sns
  install_dep @aws-cdk/aws-iam
  install_dep @aws-cdk/aws-lambda
  install_dep @aws-cdk/aws-ssm
  install_dep @aws-cdk/aws-ecr-assets
  install_dep @aws-cdk/aws-ec2

  echo "| setup complete at: $PWD"
  echo "| 'cdk' is: $(which cdk)"
}

function fail() {
  echo "❌  $@"
  exit 1
}

function assert_diff() {
  local test=$1
  local actual=$2
  local expected=$3

  diff -w ${actual} ${expected} || {
    echo
    echo "+-----------"
    echo "| expected:"
    cat ${expected}
    echo "|--"
    echo
    echo "+-----------"
    echo "| actual:"
    cat ${actual}
    echo "|--"
    echo
    fail "assertion failed. ${test}"
  }
}

function assert() {
  local command="$1"

  local expected=$(mktemp)
  local actual=$(mktemp)

  echo "| running ${command}"

  eval "$command" > ${actual} || {
    fail "command ${command} non-zero exit code"
  }

  cat > ${expected}

  assert_diff "command: ${command}" "${actual}" "${expected}"
}

function assert_lines() {
  local data="$1"
  local expected="$2"
  echo "| assert that last command returned ${expected} line(s)"

  local lines="$(echo "${data}" | wc -l)"
  if [ "${lines}" -ne "${expected}" ]; then
    echo "${data}"
    fail "response has ${lines} lines and we expected ${expected} lines to be returned"
  fi
}

function strip_color_codes() {
    perl -pe 's/\e\[?.*?[\@-~]//g'
}
