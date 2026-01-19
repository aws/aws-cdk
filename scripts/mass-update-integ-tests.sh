#!/bin/bash
echo
for dir in packages/@aws-cdk-testing/framework-integ packages/@aws-cdk/*; do
    echo $dir
    npx integ-runner --unstable=toolkit-lib-engine --directory $dir --update-on-failed --disable-update-workflow "$@"
done
