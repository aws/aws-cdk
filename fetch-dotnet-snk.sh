#!/bin/bash
set -euo pipefail

# This script retrieves the .snk file needed to create strong names for .NET assemblies.

sudo apt install jq -y

echo "Retrieving SNK..."
ROLE=$(aws sts assume-role --region us-east-2 --role-arn ${DOTNET_STRONG_NAME_ROLE_ARN:-} --role-session-name "cdk-dotnet-snk")
export AWS_ACCESS_KEY_ID=$(echo $ROLE | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $ROLE | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $ROLE | jq .Credentials.SessionToken)

SNK_SECRET=$(aws secretsmanager get-secret-value --region us-east-2 --secret-id ${DOTNET_STRONG_NAME_SECRET_ID:-})
TMP_DIR=$(mktemp -d)
TMP_KEY="$TMP_DIR/key.snk"
echo $SNK_SECRET | jq -r .SecretBinary | base64 --decode > $TMP_KEY

for PACKAGE_PATH in packages/@aws-cdk/*; do
    JSII_PROPERTY=$(cat "$PACKAGE_PATH/package.json" | jq -r .jsii)
    if [ -z $JSII_PROPERTY ]; then
        continue
    fi

    cp $TMP_KEY $PACKAGE_PATH
done

rm -rf $TMP_DIR
