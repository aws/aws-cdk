#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------
# this test verifies that deployment is skipped when the template did not
# change, and that `--force` can be used to override this behavior.

setup

# we are using a stack with a nested stack because CFN will always attempt to
# update a nested stack, which will allow us to verify that updates are actually
# skipped unless --force is specified.
stack_name="${STACK_NAME_PREFIX}-with-nested-stack"

get_last_changeset() {
    aws cloudformation describe-stacks --stack-name ${stack_name} --query 'Stacks[0].ChangeSetId'
}

# deploy once
echo "============================================================"
echo " deploying stack"
echo "============================================================"
cdk deploy -v ${stack_name}
changeset1=$(get_last_changeset)
echo "changeset1=${changeset1}"

echo "============================================================"
echo " deploying the same stack again (no change)"
echo "============================================================"
cdk deploy -v ${stack_name}
changeset2=$(get_last_changeset)
if [ "${changeset2}" != "${changeset1}" ]; then
    echo "TEST FAILED: expected the 'cdk deploy' will skip deployment because the app did not change"
    exit 1
fi

echo "============================================================"
echo " deploying the same stack again (no change, --force)"
echo "============================================================"
cdk deploy --force -v ${stack_name}
changeset3=$(get_last_changeset)
if [ "${changeset3}" == "${changeset1}" ]; then
    echo "TEST FAILED: expected --force to create a new changeset"
    exit 1
fi

echo "============================================================"
echo " deploying the same stack again with different tags"
echo "============================================================"
cdk deploy -v ${stack_name} --tags key=value
changeset4=$(get_last_changeset)
if [ "${changeset4}" == "${changeset1}" ]; then
    echo "TEST FAILED: expected tags to create a new changeset"
    exit 1
fi

# destroy
cdk destroy -f ${stack_name}

echo "✅  success"
