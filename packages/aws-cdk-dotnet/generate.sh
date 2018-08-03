#!/bin/bash
set -euo pipefail

rm -rf ./src
mkdir ./src
dotnet new sln -n Amazon.CDK -o ./src

NUGET_JSONMODEL=$(node -e "console.log(path.dirname(require.resolve('jsii-dotnet-jsonmodel/package.json')))")
NUGET_GENERATOR=$(node -e "console.log(path.dirname(require.resolve('jsii-dotnet-generator/package.json')))")
NUGET_RUNTIME=$(node -e "console.log(path.dirname(require.resolve('jsii-dotnet-runtime/package.json')))")

NUGET_CONFIG_CONTENT="<?xml version=\"1.0\" encoding=\"utf-8\"?>
<configuration>
  <packageSources>
    <add key=\"nuget.org\" value=\"https://api.nuget.org/v3/index.json\" protocolVersion=\"3\" />
    <add key=\"local-jsonmodel\" value=\"$NUGET_JSONMODEL\" />
    <add key=\"local-generator\" value=\"$NUGET_GENERATOR\" />
    <add key=\"local-runtime\" value=\"$NUGET_RUNTIME\" />
  </packageSources>
</configuration>"
echo $NUGET_CONFIG_CONTENT > ./src/NuGet.config

AWS_CDK=../@aws-cdk
echo "Searching $AWS_CDK for jsii packages..."
for i in $( ls $AWS_CDK ); do
    AWS_CDK_PACKAGE=$AWS_CDK/$i
    AWS_CDK_ASSEMBLY=$AWS_CDK_PACKAGE/.jsii
    if [ -e $AWS_CDK_ASSEMBLY ]; then
        echo "Generating code for $i"
        echo "jsii-pacmak -t dotnet -o ./src $AWS_CDK_PACKAGE"
        jsii-pacmak -t dotnet -o ./src $AWS_CDK_PACKAGE
    fi
done

# Ensure that all generated projects are added to the solution.
SRC=./src
for i in $( ls $SRC ); do
    CSPROJ=./src/$i/$i.csproj
    if [ -e $CSPROJ ]; then
        dotnet sln ./src/Amazon.CDK.sln add $CSPROJ
    fi
done
