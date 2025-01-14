#!/bin/bash
set -euo pipefail

# Copy the current 'aws-cdk-lib' version out from the monorepo.
cdk_version=$(node -p 'require("aws-cdk-lib/package.json").version')
constructs_range=$(node -p 'require("aws-cdk-lib/package.json").peerDependencies.constructs')
echo '{"aws-cdk-lib": "'"$cdk_version"'", "constructs": "'"$constructs_range"'"}' > resources/init-templates/.init-version.json

# Copy the recommended-feature-flags.json file out from aws-cdk-lib.
path=$(node -p 'require.resolve("aws-cdk-lib/recommended-feature-flags.json")')
cp $path resources/init-templates/.recommended-feature-flags.json

# Copy the service-spec database out from @aws-cdk/aws-service-spec.
path=$(node -p 'require.resolve("@aws-cdk/aws-service-spec/db.json.gz")')
cp $path ./
