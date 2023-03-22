#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=8196 ${NODE_OPTIONS:-}"

rm -f packages/@aws-cdk/*/lib/*.generated.*
node_modules/.bin/lerna --scope @aws-cdk/cfnspec run build
node_modules/.bin/lerna --scope @aws-cdk/cfn2ts run build
cfn2ts=$(pwd)/tools/@aws-cdk/cfn2ts/bin/cfn2ts
node_modules/.bin/lerna --concurrency=1 --no-bail exec -- bash -c "pwd && $cfn2ts --scope \$(node -p 'require(\"./package.json\")[\"cdk-build\"].cloudformation')"
