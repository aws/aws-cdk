#!/bin/bash
set -euo pipefail

# stub for the `docker` executable. it is used as CDK_DOCKER when executing unit
# tests in `test.staging.ts` It outputs the command line to
# `/tmp/docker-stub.input` and accepts one of 3 commands that impact it's
# behavior.

HISTORY=/tmp/docker-stub.input.concat
CURRENT=/tmp/docker-stub.input

echo "$@" >> ${HISTORY}
echo "$@" > ${CURRENT}

CONTAINER_ID=6dd99c4b40b43d339a3a9140f5b6608014dbc74862636844f7378e4f664bb563

# create needs to return a container id.
if echo "$@" | grep -q "create "; then
  echo ${CONTAINER_ID}
  exit 0
fi

# no-op removal since we haven't really started anything.
if echo "$@" | grep -q "rm -vf ${CONTAINER_ID}"; then
  exit 0
fi

# start the container and maybe fail it.
if echo "$@" | grep -q "start ${CONTAINER_ID}"; then
  # check the history to see whether or not to fail the container.
  # this is currently determined by the command passed to 'create'
  if grep -q "DOCKER_STUB_FAIL" ${HISTORY}; then
    echo "A HUGE FAILING DOCKER STUFF"
    exit 1
  else
    exit 0
  fi
fi

# create an output file if necessary
if echo "$@" | grep -q "cp ${CONTAINER_ID}:/asset-output"; then
  # check the history to see whether or not to create the output file or not
  # this is currently determined by the command passed to 'create'
  if grep -q "DOCKER_STUB_SUCCESS_NO_OUTPUT" ${HISTORY}; then
    exit 0
  else
    outdir=$(echo "$@" | cut -d" " -f3)
    touch ${outdir}/test.txt
    exit 0
  fi
fi

# ignore other cp commands since they don't matter
if echo "$@" | grep -q "cp"; then
  exit 0
fi


echo "Docker mock cannot handle the command: '$@' - Please check if the command is valid and amend this mock to consider it"
exit 1
