#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

assert "cdk synth cdk-toolkit-integration-test-1" <<HERE
Resources:
    topic69831491:
        Type: 'AWS::SNS::Topic'

HERE

assert "cdk synth cdk-toolkit-integration-test-2" <<HERE
Resources:
    topic152D84A37:
        Type: 'AWS::SNS::Topic'
    topic2A4FB547F:
        Type: 'AWS::SNS::Topic'

HERE

echo "✅  success"
