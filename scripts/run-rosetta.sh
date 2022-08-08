#!/bin/bash
#
# Run jsii-rosetta on all jsii packages, using the S3 build cache if available.
#
#       Usage: run-rosetta [--infuse] [--pkgs-from PKGSFILE]
#
# Performs three steps, in that order:
#
# 1. Run `rosetta extract` to read and translate all examples from all JSII
#    assemblies.
#
# 2. Run `rosetta infuse` to traverse all examples we have, and copy them
#    to classes that don't have an example yet.
#
# 3. Run `cdk-generate-synthetic-examples` to find all types that *still*
#    don't have associated examples, and generate synthetic examples.
#
# If you already have a file with a list of all the JSII package directories
# in it, pass it as the first argument. Otherwise, this script will run
# 'list-packages' to determine a list itself.
set -eu
scriptdir=$(cd $(dirname $0) && pwd)

ROSETTA=${ROSETTA:-npx jsii-rosetta}

infuse=false
jsii_pkgs_file=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --infuse)
            infuse="true"
            ;;
        --pkgs-from)
            jsii_pkgs_file="$2"
            shift
            ;;
        -h|--help)
            echo "Usage: run-rosetta.sh [--infuse] [--pkgs-from FILE]" >&2
            exit 1
            ;;
        *)
            echo "Unrecognized argument: $1" >&2
            exit 1
            ;;
    esac
    shift
done


if [[ "${jsii_pkgs_file}" = "" ]]; then
    echo "Collecting package list..." >&2
    TMPDIR=${TMPDIR:-$(dirname $(mktemp -u))}
    node $scriptdir/list-packages $TMPDIR/jsii.txt $TMPDIR/nonjsii.txt
    jsii_pkgs_file=$TMPDIR/jsii.txt
fi

rosetta_cache_file=$HOME/.s3buildcache/rosetta-cache.tabl.json
extract_opts=""
if $infuse; then
    extract_opts="--infuse"
fi

#----------------------------------------------------------------------

# Compile examples with respect to "aws-cdk-lib" directory, as all packages will
# be symlinked there so they can all be included.
echo "💎 Extracting code samples" >&2
time $ROSETTA extract \
    --compile \
    --verbose \
    --cache ${rosetta_cache_file} \
    --directory packages/aws-cdk-lib \
    ${extract_opts} \
    $(cat $jsii_pkgs_file)

if $infuse; then
    echo "💎 Generating synthetic examples for the remainder" >&2
    time npx cdk-generate-synthetic-examples@^0.1.14 \
        $(cat $jsii_pkgs_file)

    time $ROSETTA extract \
        --compile \
        --verbose \
        --cache ${rosetta_cache_file} \
        --directory packages/aws-cdk-lib \
        $(cat $jsii_pkgs_file)
fi

time $ROSETTA trim-cache \
    ${rosetta_cache_file} \
    $(cat $jsii_pkgs_file)
