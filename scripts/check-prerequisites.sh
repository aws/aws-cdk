#!/bin/bash
set -euo pipefail

# Testing with this to simulate different installed apps:
# docker run -it -v ~/Source/aws-cdk:/var/cdk ubuntu bash

# Note: Don't use \d in regex, it doesn't work on Macs without GNU tools installed
# Use [0-9] instead

app=""
app_min=""
app_v=""

die() { echo "$*" 1>&2 ; exit 1; }
wrong_version() { echo "Found $app version $app_v. Install $app >= $app_min" 1>&2; exit 1; }

check_which() {
    local app=$1
    local min=$2

    echo -e "Checking if $app is installed... \c"

    w=$(which ${app}) || w=""

    if [ -z $w ] || [ $w == "$app not found" ]
    then
        die "Missing dependency: $app. Install $app >= $min"
    else
        echo "Ok"
    fi
}

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

# [Java OpenJDK 8, 11, 14]

# Follow "More Info" on a new Mac when trying javac, install latest Oracle:
# javac 14.0.1

# apt install default-jdk on Ubuntu
# javac 11.0.7

# Install Coretto 8 from Amazon web site
# javac --version fails
# javac -version
# javac 1.8.0_252
# Old javac versions output version to stderr... why

app="javac"
app_min="1.8.0"
check_which $app $app_min
app_v=$(${app} -version 2>&1)
echo -e "Checking javac version... \c"
# 1.8
if [ $(echo $app_v | grep -c -E "1\.8\.[0-9].*") -eq 1 ]
then   
    echo "Ok"
else
    # 11 or 14
    if [ $(echo $app_v | grep -c -E "1[14]\.[0-9]\.[0-9].*") -eq 1 ]
    then    
        echo "Ok"
    else
        wrong_version
    fi
fi

# [Apache Maven >= 3.6.0, < 4.0]
app="mvn"
app_min="3.6.0"
check_which $app $app_min
app_v=$(${app} --version)
echo -e "Checking mvn version... \c"
if [ $(echo $app_v | grep -c -E "3\.[6789]\.[0-9].*") -eq 1 ]
then   
    echo "Ok"
else
    wrong_version
fi

# [.NET Core SDK 3.1.*]
app="dotnet"
app_min="3.1.0"
check_which $app $app_min
app_v=$(${app} --version)
echo -e "Checking $app version... \c"
if [ $(echo $app_v | grep -c -E "3\.1\.[0-9].*") -eq 1 ]
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
echo -e "Checking $app version... \c"
if [ $(echo $app_v | grep -c -E "3\.[6789]\.[0-9].*") -eq 1 ]
then   
    echo "Ok"
else
    wrong_version
fi

# [Ruby >= 2.5.1, < 3.0]
app="ruby"
app_min="2.5.1"
check_which $app $app_min
app_v=$(${app} --version)
echo -e "Checking $app version... \c"
if [ $(echo $app_v | grep -c -E "2\.[56789]\.[0-9].*") -eq 1 ]
then   
    echo "Ok"
else
    wrong_version
fi

# [Docker >= 19.03]
app="docker"
app_min="19.03.0"
check_which $app $app_min

# Make sure docker is running
echo -e "Checking if docker is running... \c"
docker_running=$(docker ps)
if [ $? -eq 0 ]
then    
    echo "Ok"
else
    die "Docker is not running"
fi

