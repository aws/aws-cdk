#!/bin/bash
set -euo pipefail

# stub for the `docker` executable. it is used as CDK_DOCKER when executing unit
# tests in `test.staging.ts` It outputs the command line to
# `/tmp/docker-stub.input` and accepts one of 3 commands that impact it's
# behavior.

echo "$@" > /tmp/docker-stub.input

if echo "$@" | grep "DOCKER_STUB_SUCCESS_NO_OUTPUT"; then
  exit 0
fi

if echo "$@" | grep "DOCKER_STUB_FAIL"; then
  echo "A HUGE FAILING DOCKER STUFF"
  exit 1
fi

if echo "$@" | grep "DOCKER_STUB_SUCCESS"; then
  outdir=$(echo "$@" | xargs -n1 | grep "/asset-output" | head -n1 | cut -d":" -f1)
  touch ${outdir}/test.txt
  exit 0
fi

echo "Docker mock only supports one of the following commands: DOCKER_STUB_SUCCESS_NO_OUTPUT,DOCKER_STUB_FAIL,DOCKER_STUB_SUCCESS"
exit 1
