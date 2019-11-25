set -eu
scriptdir=$(cd $(dirname $0) && pwd)
cd ${scriptdir}

if [[ -z "${CREDS_SET:-}" ]]; then
    # Check that credentials are configured (will error & abort if not)
    creds=$(aws sts get-caller-identity)

    export TEST_ACCOUNT=$(node -p "($creds).Account")
    export TEST_REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}
    export CREDS_SET=1
fi


if [[ "${STACK_NAME_PREFIX:-}" == "" ]]; then
  if ${IS_CANARY:-false}; then
    export STACK_NAME_PREFIX=cdk-toolkit-canary
  else
    export STACK_NAME_PREFIX=cdk-toolkit-integration
  fi
fi

#----------------------------------------------------------------------------------
# Only functions from here on out

function log() {
  echo >&2 "| $@"
}

function header() {
  log
  log "============================================================================================"
  log $@
  log "============================================================================================"
}

function cleanup_stack() {
  local stack_arn=$1
  echo "| ensuring ${stack_arn} is cleaned up"
  if aws cloudformation describe-stacks --stack-name ${stack_arn} 2> /dev/null; then
    aws cloudformation delete-stack --stack-name ${stack_arn}
  fi
}

integ_test_dir=/tmp/cdk-integ-test

# Prepare the app fixture
#
# If this is done in the main test script, it will be skipped
# in the subprocess scripts since the app fixture can just be reused.
function prepare_fixture() {
  if [[ -z "${FIXTURE_PREPARED:-}" ]]; then
    log "Preparing app fixture..."

    rm -rf $integ_test_dir
    mkdir -p $integ_test_dir
    cp -R app/* $integ_test_dir
    cd $integ_test_dir

    npm install \
        @aws-cdk/core \
        @aws-cdk/aws-sns \
        @aws-cdk/aws-iam \
        @aws-cdk/aws-lambda \
        @aws-cdk/aws-ssm \
        @aws-cdk/aws-ecr-assets \
        @aws-cdk/aws-ec2

    echo "| setup complete at: $PWD"
    echo "| 'cdk' is: $(type -p cdk)"

    export FIXTURE_PREPARED=1
  fi
}

function cleanup() {
  cleanup_stack ${STACK_NAME_PREFIX}-test-1
  cleanup_stack ${STACK_NAME_PREFIX}-test-2
  cleanup_stack ${STACK_NAME_PREFIX}-iam-test
}

function setup() {
  cleanup
  prepare_fixture
  cd $integ_test_dir
}

function fail() {
  echo "❌  $@"
  exit 1
}

#
# compares two files
# usage: assert_diff TEST_NAME actual-file expected-file
#
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

#
# compares the result of $1 with STDIN
# usage: assert COMMAND < file
#
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
