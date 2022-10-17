#!/bin/bash

# Copy files from the @aws-cdk/asset-awscli-v1 devDependency into
# this package, so that they will be included in the released package.

# Set bash to exit the script immediately on any error (e) and if any unset (u)
# variable is referenced.
set -eu

dir=$(node -pe 'path.resolve(require.resolve("@aws-cdk/asset-awscli-v1"), "../..")')

cp $dir/layer/requirements.txt ./layer
cp $dir/lib/layer.zip ./lib