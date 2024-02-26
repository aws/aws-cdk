#!/bin/bash
set -eu
npx integ-runner --directory packages/@aws-cdk-testing/framework-integ --update-on-failed --disable-update-workflow "$@"
