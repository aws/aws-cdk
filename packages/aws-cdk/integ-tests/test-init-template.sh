#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

rm -rf /tmp/cdk-integ-test
mkdir -p /tmp/cdk-integ-test
cd /tmp/cdk-integ-test

cdk init app -l typescript
npm run build
cdk synth

rm -rf /tmp/cdk-integ-test
mkdir -p /tmp/cdk-integ-test
cd /tmp/cdk-integ-test

cdk init sample-app -l typescript
npm run build
cdk synth

echo "✅  success"

