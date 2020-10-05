#!/bin/bash
set -euo pipefail

# This script retrieves the .snk file needed to create strong names for .NET assemblies.

function echo_usage() {
    echo "USAGE: Set the following environment variables, then run ./fetch-dotnet-snk.sh with no arguments."
    echo -e "\tDOTNET_STRONG_NAME_ENABLED=true"
    echo -e "\tDOTNET_STRONG_NAME_ROLE_ARN=<ARN of a role with access to the secret. You must have iam:AssumeRole permissions for this role.>"
    echo -e "\tDOTNET_STRONG_NAME_SECRET_REGION=<The AWS region (i.e. us-east-2) in which in the secret is stored.>"
    echo -e "\tDOTNET_STRONG_NAME_SECRET_ID=<The name (i.e. production/my/key) or ARN of the secret containing the .snk file.>"
}

if [ "${DOTNET_STRONG_NAME_ENABLED:-false}" != "true" ]; then
    echo "Environment variable DOTNET_STRONG_NAME_ENABLED is not set to true. Skipping strong-name signing."
    exit 0
fi

echo "Retrieving SNK..."

yum install jq -y

if [ -z "${DOTNET_STRONG_NAME_ROLE_ARN:-}" ]; then
    echo "Strong name signing is enabled, but DOTNET_STRONG_NAME_ROLE_ARN is not set."
    echo_usage
    exit 1
fi

if [ -z "${DOTNET_STRONG_NAME_SECRET_REGION:-}" ]; then
    echo "Strong name signing is enabled, but DOTNET_STRONG_NAME_SECRET_REGION is not set."
    echo_usage
    exit 1
fi

if [ -z "${DOTNET_STRONG_NAME_SECRET_ID:-}" ]; then
    echo "Strong name signing is enabled, but DOTNET_STRONG_NAME_SECRET_ID is not set."
    echo_usage
    exit 1
fi

ROLE=$(aws sts assume-role --region ${DOTNET_STRONG_NAME_SECRET_REGION:-} --role-arn ${DOTNET_STRONG_NAME_ROLE_ARN:-} --role-session-name "jsii-dotnet-snk")
export AWS_ACCESS_KEY_ID=$(echo $ROLE | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $ROLE | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $ROLE | jq .Credentials.SessionToken)

SNK_SECRET=$(aws secretsmanager get-secret-value --region ${DOTNET_STRONG_NAME_SECRET_REGION:-} --secret-id ${DOTNET_STRONG_NAME_SECRET_ID:-})
TMP_DIR=$(mktemp -d)
TMP_KEY="$TMP_DIR/key.snk"
echo $SNK_SECRET | jq -r .SecretBinary | base64 --decode > $TMP_KEY

for PACKAGE_PATH in packages/@aws-cdk/*; do
    JSII_PROPERTY=$(cat "$PACKAGE_PATH/package.json" | jq -r .jsii)
    if [ -z "${JSII_PROPERTY}" ]; then
        continue
    fi

    cp $TMP_KEY $PACKAGE_PATH
done

rm -rf $TMP_DIR
