#!/bin/bash

set -u

cd "$(dirname "$0")"

# This script runs all tests in this package, including tests written in Python.
# If any arguments are passed to this script, it passes them to Jest and runs only the tests that match the pattern.

if [ "$#" -gt 0 ]; then
  yarn run jest "$@"
else
  tests=(
    "yarn run jest"
    "./test/aws-s3/notifications-resource-handler/test.sh"
    "./test/aws-s3-deployment/bucket-deployment-handler/test.sh"
  )

  # Run all tests and exit 1 if any of them failed
  exit_status=0
  for test in "${tests[@]}"; do
    $test || exit_status=1
  done

  exit $exit_status
fi
