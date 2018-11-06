#!/bin/bash
rm -f packages/@aws-cdk/*/lib/*.generated.*
node_modules/.bin/lerna --scope @aws-cdk/cfnspec run build
node_modules/.bin/lerna --scope cfn2ts run build
cfn2ts=$(pwd)/tools/cfn2ts/bin/cfn2ts
node_modules/.bin/lerna --concurrency=1 --no-bail exec -- bash -c "pwd && $cfn2ts --scope \$(node -p 'require(\"./package.json\")[\"cdk-build\"].cloudformation')"
