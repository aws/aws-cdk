#!/bin/bash
set -e
cd $(dirname $0)
(cd .. && cdk synth) > /tmp/actual.yaml
diff /tmp/actual.yaml expected.yaml
