#!/bin/bash

# Get the version to use from the package.json devDependencies
lineWithPackageVersion=$(grep '@aws-cdk/asset-awscli-v1' ./package.json)
version=$(echo $lineWithPackageVersion | cut -d '"' -f 4)

echo "Downloading @aws-cdk/asset-awscli-v1@$version from npm"
npm pack @aws-cdk/asset-awscli-v1@$version -q

echo "Extracting layer.zip and requirements.txt from aws-cdk-asset-awscli-v1-$version.tgz"
tar -zxvf aws-cdk-asset-awscli-v1-$version.tgz package/lib/layer.zip package/layer/requirements.txt

echo "Moving layer.zip and requirements.txt to desired destinations"
mv ./package/lib/layer.zip ./lib/
mv ./package/layer/requirements.txt ./layer

echo "Cleaning up"
rm aws-cdk-asset-awscli-v1-$version.tgz
rm -r ./package

echo "download-fallback.sh complete"