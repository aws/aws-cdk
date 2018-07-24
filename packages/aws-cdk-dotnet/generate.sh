#!/bin/bash
set -euo pipefail

rm -rf ./src
mkdir ./src
dotnet new sln -n Amazon.CDK -o ./src

AWS_CDK=../@aws-cdk
echo "Searching $AWS_CDK for jsii packages..."
for i in $( ls $AWS_CDK ); do
    # Generation of aws-custom-resources is blocked due to https://github.com/awslabs/aws-cdk/issues/383
    if [ "$i" == "aws-custom-resources" ]; then
        continue
    fi

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

