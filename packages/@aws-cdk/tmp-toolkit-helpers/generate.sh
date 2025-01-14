#!/bin/bash
set -euo pipefail

commit=${CODEBUILD_RESOLVED_SOURCE_VERSION:-}
# CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local build or CodePipeline build),
# use the HEAD commit hash
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > resources/build-info.json <<HERE
{
  "comment": "Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ") by generate.sh",
  "commit": "${commit:0:7}"
}
HERE

# Copy the current 'aws-cdk-lib' version out from the monorepo.
cdk_version=$(node -p 'require("aws-cdk-lib/package.json").version')
constructs_range=$(node -p 'require("aws-cdk-lib/package.json").peerDependencies.constructs')
echo '{"aws-cdk-lib": "'"$cdk_version"'", "constructs": "'"$constructs_range"'"}' > resources/init-templates/.init-version.json

# Copy the recommended-feature-flags.json file out from aws-cdk-lib.
path=$(node -p 'require.resolve("aws-cdk-lib/recommended-feature-flags.json")')
cp $path resources/init-templates/.recommended-feature-flags.json

# Copy the service-spec database out from @aws-cdk/aws-service-spec.
path=$(node -p 'require.resolve("@aws-cdk/aws-service-spec/db.json.gz")')
cp $path ./resources
