#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

setup

function nonfailing_diff() {
    cdk diff --no-fail $1 2>&1 | strip_color_codes
}

assert "nonfailing_diff ${STACK_NAME_PREFIX}-iam-test" <<HERE
Stack ${STACK_NAME_PREFIX}-iam-test
IAM Statement Changes
┌───┬─────────────────┬────────┬────────────────┬────────────────────────────┬───────────┐
│   │ Resource        │ Effect │ Action         │ Principal                  │ Condition │
├───┼─────────────────┼────────┼────────────────┼────────────────────────────┼───────────┤
│ + │ \${SomeRole.Arn} │ Allow  │ sts:AssumeRole │ Service:ec2.amazon.aws.com │           │
└───┴─────────────────┴────────┴────────────────┴────────────────────────────┴───────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Resources
[+] AWS::IAM::Role SomeRole SomeRole6DDC54DD

HERE

echo "✅  success"
