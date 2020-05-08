#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup
# asserting the the NestedStack is shown
assert "cdk synth ${STACK_NAME_PREFIX}-with-nested-stack" <<HERE
NestedStacks:
  ${STACK_NAME_PREFIX}-with-nested-stack:
    - MyNestedNestedStackMyNestedNestedStackResourceDCBE3BEF:
        Template:
          Resources:
            MyTopic86869434:
              Type: AWS::SNS::Topic
              Metadata:
                aws:cdk:path: with-nested-stack/MyNested/MyTopic/Resource
HERE

echo "✅  success"
