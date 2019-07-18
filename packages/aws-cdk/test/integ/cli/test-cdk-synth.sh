#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

assert "cdk synth ${STACK_NAME_PREFIX}-test-1" <<HERE
Resources:
  topic69831491:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-1/topic/Resource

HERE

assert "cdk synth ${STACK_NAME_PREFIX}-test-2" <<HERE
Resources:
  topic152D84A37:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-2/topic1/Resource
  topic2A4FB547F:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-2/topic2/Resource

HERE

echo "✅  success"
