#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------
setup

announce() {
  echo "~~~~ $1 ~~~~"
}

cleanup() {
  # revert the file we renamed for the test
  mv ${integ_test_dir}/docker/Dockerfile.Custom.bak ${integ_test_dir}/docker/Dockerfile.Custom
}

trap cleanup EXIT INT

# default is cdk.out
cdk synth

assembly="$(mktemp -d)"

# synthesize a cloud assembly
cdk synth --output ${assembly}

# directories should be the same
diff cdk.out ${assembly}

# change to some random directory to make sure cdk.json doesn't take into account
cd $(mktemp -d)

# "cdk ls" agaisnt a cloud assembly (spot check)
announce "cdk ls"
cdk -a ${assembly} ls | grep "${STACK_NAME_PREFIX}-lambda"
cdk -a ${assembly} ls | grep "${STACK_NAME_PREFIX}-test-1"
cdk -a ${assembly} ls | grep "${STACK_NAME_PREFIX}-test-2"

# change to assembly directory and verify relative path works too
cd ${assembly}

# "cdk synth" against a cloud assembly
announce "cdk synth"
cdk -a . synth ${STACK_NAME_PREFIX}-test-2 | grep "topic152D84A37"

# deploy a lambda function without synth (uses assets)
announce "cdk deploy"
cdk -a . deploy "${STACK_NAME_PREFIX}-lambda" --require-approval=never

# rename the original custom docker file that was used during synth.
# this verifies that the assemly has a copy of it and that the manifest uses
# relative paths to reference to it.
mv ${integ_test_dir}/docker/Dockerfile.Custom ${integ_test_dir}/docker/Dockerfile.Custom.bak

# deploy a docker image with custom file without synth (uses assets)
cdk -a . deploy "${STACK_NAME_PREFIX}-docker-with-custom-file" --require-approval=never

# destory
announce "cdk destroy"
cdk -a . destroy -f "${STACK_NAME_PREFIX}-lambda"
# cdk -a . destroy -f "${STACK_NAME_PREFIX}-docker"
