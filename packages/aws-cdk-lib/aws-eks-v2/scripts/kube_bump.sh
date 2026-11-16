#!/bin/bash

if [ $# -lt 2 ]; then
 echo "usage: scripts/kube_bump.sh <previous_version> <new_version>"
 exit 1
fi

PREVIOUS_KUBE_VERSION=$1
LATEST_KUBE_VERSION=$2

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
EKS_PATH="$SCRIPT_PATH/.."

sed -i "s/const LATEST_KUBERNETES_VERSION = '${PREVIOUS_KUBE_VERSION}/const LATEST_KUBERNETES_VERSION = '${LATEST_KUBE_VERSION}/" "$EKS_PATH/lib/cluster.ts"

INTEG_FILES=$(find "$EKS_PATH/test" -type f -name 'integ.*.json')
echo "$INTEG_FILES" | xargs sed -i "s#eks/optimized-ami/${PREVIOUS_KUBE_VERSION}#eks/optimized-ami/${LATEST_KUBE_VERSION}#g"

NUMERIC_PREVIOUS_VERSION=$(sed 's/[^0-9]*//g' <<< "$PREVIOUS_KUBE_VERSION")
NUMERIC_LATEST_VERSION=$(sed 's/[^0-9]*//g' <<< "$LATEST_KUBE_VERSION")
echo "$INTEG_FILES" | xargs sed -i "s#awsserviceeksoptimizedami${NUMERIC_PREVIOUS_VERSION}amazonlinux2#awsserviceeksoptimizedami${NUMERIC_LATEST_VERSION}amazonlinux2#g"