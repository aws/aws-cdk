#!/bin/bash
npx integ-runner --unstable=toolkit-lib-engine --directory packages/@aws-cdk-testing/framework-integ --update-on-failed --disable-update-workflow "$@"
for dir in packages/@aws-cdk/*; do
    npx integ-runner --unstable=toolkit-lib-engine --directory $dir --update-on-failed --disable-update-workflow "$@"
done
