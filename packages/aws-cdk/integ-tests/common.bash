scriptdir=$(cd $(dirname $0) && pwd)

toolkit_bin="${scriptdir}/../bin"

if [ ! -x ${toolkit_bin}/cdk ]; then
  echo "Unable to find 'cdk' under ${toolkit_bin}"
  exit 1
fi

# make sure "this" toolkit is in the path
export PATH=${toolkit_bin}:$PATH

function cleanup_stack() {
  local stack_arn=$1
  echo "| ensuring ${stack_arn} is cleaned up"
  if aws cloudformation describe-stacks --stack-name ${stack_arn} 2> /dev/null; then
    aws cloudformation delete-stack --stack-name ${stack_arn}
  fi
}

function cleanup() {
  cleanup_stack cdk-toolkit-integration-test-1
  cleanup_stack cdk-toolkit-integration-test-2
  cleanup_stack cdk-toolkit-integration-iam-test
}

function setup() {
  cleanup
  rm -rf /tmp/cdk-integ-test
  mkdir -p /tmp/cdk-integ-test
  cp -R app/* /tmp/cdk-integ-test
  cd /tmp/cdk-integ-test

  # "install" symlinks to the cdk core and SNS modules
  # we don't use "npm install" here so that the modules will
  # be from the same version as the toolkit we are testing
  mkdir -p node_modules/@aws-cdk
  (
    cd node_modules/@aws-cdk
    ln -s ${scriptdir}/../../@aws-cdk/aws-sns
    ln -s ${scriptdir}/../../@aws-cdk/aws-iam
    ln -s ${scriptdir}/../../@aws-cdk/cdk
  )
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

  $command > ${actual} || {
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
