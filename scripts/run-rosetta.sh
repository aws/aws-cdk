#!/bin/bash
#
# Run jsii-rosetta on all jsii packages, using the S3 build cache if available.
#
#       Usage: run-rosetta [PKGSFILE]
#
# If you already have a file with a list of all the JSII package directories
# in it, pass it as the first argument. Otherwise, this script will run
# 'list-packages' to determine a list itself.
set -eu
scriptdir=$(cd $(dirname $0) && pwd)

ROSETTA=${ROSETTA:-npx jsii-rosetta}

if [[ "${1:-}" = "" ]]; then
    echo "Collecting package list..." >&2
    TMPDIR=${TMPDIR:-$(dirname $(mktemp -u))}
    node $scriptdir/list-packages $TMPDIR/jsii.txt $TMPDIR/nonjsii.txt
    jsii_pkgs_file=$TMPDIR/jsii.txt
else
    jsii_pkgs_file=$1
fi

rosetta_cache_file=$HOME/.s3buildcache/rosetta-cache.tabl.json
rosetta_cache_opts=""
if [[ -f $rosetta_cache_file ]]; then
    rosetta_cache_opts="--cache-from ${rosetta_cache_file}"
fi

$ROSETTA \
  --compile \
  --verbose \
  --output samples.tabl.json \
  $rosetta_cache_opts \
  --directory packages/decdk \
  $(cat $jsii_pkgs_file)

if [[ -d $(dirname $rosetta_cache_file) ]]; then
    # If the cache directory is available, copy the current tablet into it
    cp samples.tabl.json $rosetta_cache_file
fi
