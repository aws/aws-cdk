#!/bin/bash
set -euo pipefail

scriptdir=$(cd $(dirname $0) && pwd)

# Testing with this to simulate different installed apps:
# docker run -it -v ~/Source/aws-cdk:/var/cdk ubuntu bash

# Note: Don't use \d in regex, it doesn't work on Macs without GNU tools installed
# Use [0-9] instead

die() { echo "$*" 1>&2 ; exit 1; }
wrong_version() { echo "Found $app version $app_v. Install $app >= $app_min" 1>&2; exit 1; }

check_which() {
    local app=$1
    local min=$2

    echo -e "Checking if $app is installed... \c"

    w=$(which ${app}) || w=""

    if [ -z "$w" ] || [ "$w" == "$app not found" ]
    then
        die "Missing dependency: $app. Install $app >= $min"
    else
        echo "Ok"
    fi
}

app=""
app_min=""
app_v=""

# [Node.js >= 10.13.0]
#   ⚠️ versions `13.0.0` to `13.6.0` are not supported due to compatibility issues with our dependencies.
app="node"
app_min="v10.13.0"
check_which $app $app_min
app_v=$(node --version)

# Check for version 10.*.* - 29.*.*
echo -e "Checking node version... \c"
if [ $(echo $app_v | grep -c -E "v[12][0-9]\.[0-9]+\.[0-9]+") -eq 1 ]
then
    # Check for version 13.0 to 13.6
    if [ $(echo $app_v | grep -c -E "v13\.[0-6]\.[0-9]+") -eq 1 ]
    then
        die "node versions 13.0.0 to 13.6.0 are not supported due to compatibility issues with our dependencies."
    else
        # Check for version < 10.13
        if [ $(echo $app_v | grep -c -E "v10\.([0-9]|1[0-2])\.[0-9]+") -eq 1 ]
        then
            wrong_version
        else
            echo "Ok"
        fi
    fi
else
    echo "Not 12"
    wrong_version
fi

# [Yarn >= 1.19.1, < 1.30]
app="yarn"
app_min="1.19.1"
check_which $app $app_min
app_v=$(${app} --version)
echo -e "Checking yarn version... \c"
if [ $(echo $app_v | grep -c -E "1\.(19|2[0-9])\.[0-9]+") -eq 1 ]
then
    echo "Ok"
else
    wrong_version
fi

# Container Client
container_client=${CDK_DOCKER:-docker}
docker_min="19.03.0"
finch_min="0.3.0"

# [Docker >= 19.03]
if [ "$container_client" == "docker" ]; then
    check_which $container_client $docker_min

    # Make sure docker is running
    echo -e "Checking if Docker is running... \c"
    docker_running=$(docker ps)
    if [ $? -eq 0 ]
    then
        echo "Ok"
    else
        die "Docker is not running"
    fi

# [finch >= 0.3.0]
elif [ "$container_client" == "finch" ]; then
    check_which $container_client $finch_min

    # Make sure docker is running
    echo -e "Checking if finch is running... \c"
    finch_running=$($container_client ps)
    if [ $? -eq 0 ]
    then
        echo "Ok"
    else
        die "Finch is not running"
    fi
else
    echo "⚠️ Dependency warning: Unknown container client detected. You have set \"CDK_DOCKER=$CDK_DOCKER\"."
    check_which $container_client "(unknown version requirement)"
    echo "While any docker compatible client can be used as a drop-in replacement, support for \"$CDK_DOCKER\" is unknown."
    echo "Proceed with caution."
    echo -e "Checking if $container_client is running... \c"
    client_running=$($container_client ps)
    if [ $? -eq 0 ]
    then
        echo "Ok"
    else
        die "$CDK_DOCKER is not running"
    fi
fi

# [.NET == 6.0.x]
app="dotnet"
app_min="6.0.100"
check_which $app $app_min
app_v=$(${app} --list-sdks)
echo -e "Checking dotnet version... \c"
if [ $(echo $app_v | grep -c -E "[67]\.[0-9]+\.[0-9]+") -eq 1 ]
then
    echo "Ok"
else
    wrong_version
fi

# [Python >= 3.6.5, < 4.0]
app="python3"
app_min="3.6.5"
check_which $app $app_min
app_v=$(${app} --version)
echo -e "Checking python3 version... \c"
if [ $(echo $app_v | grep -c -E "3\.([6-9]|1[0-9])\.[0-9]+") -eq 1 ]
then
    echo "Ok"
else
    wrong_version
fi
