lineWithPackageVersion=$(grep '@aws-cdk/asset-awscli-v1' ./package.json)
version=$(echo $lineWithPackageVersion | cut -d '"' -f 4)

echo $version

npm pack @aws-cdk/asset-awscli-v1@$version -q