#!/bin/bash
set -euo pipefail
cd $(dirname $0)
export PATH=../bin:$PATH

announce() {
  echo "-------------------------------------------------"
  echo "$@"
}

expect_success() {
  announce $@
  set +e
  $@
  local exit_code=$?
  set -e

  if [ "${exit_code}" -ne 0 ]; then
    echo "Command expected to succeed: $@"
    exit 1
  fi
}

expect_failure() {
  announce $@
  set +e
  $@
  local exit_code=$?
  set -e
  if [ "${exit_code}" -eq 0 ]; then
    echo "Command expected to fail: $@"
    exit 1
  fi
}

cdk-applet-js test1.yaml '{ "type": "synth", "stacks": ["TestApplet"] }' | node strip-stacktrace.js > /tmp/actual1.json
expect_success diff expected1.json /tmp/actual1.json

cdk-applet-js test2.yaml '{ "type": "synth", "stacks": ["TestApplet"] }' | node strip-stacktrace.js > /tmp/actual2.json
expect_success diff expected2.json /tmp/actual2.json

# applets can use the host as shebang
chmod +x ./test3.yaml # since codebuild loses permissions
./test3.yaml '{ "type": "synth", "stacks": ["Applet"] }' | node strip-stacktrace.js > /tmp/actual3.json
expect_success diff expected3.json /tmp/actual3.json

expect_failure cdk-applet-js negative-test4.yaml
expect_failure cdk-applet-js negative-test5.yaml
expect_failure cdk-applet-js negative-test6.yaml
expect_failure cdk-applet-js negative-test7.yaml

echo "PASS"
