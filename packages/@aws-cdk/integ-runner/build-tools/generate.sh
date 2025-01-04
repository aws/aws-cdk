#!/bin/bash
set -euo pipefail

# Copy the recommended-feature-flags.json file out from aws-cdk-lib.
path=$(node -p 'require.resolve("aws-cdk-lib/recommended-feature-flags.json")')
cp $path lib/recommended-feature-flags.json