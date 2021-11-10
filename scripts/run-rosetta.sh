#!/bin/bash
#
# Run jsii-rosetta on all jsii packages, using the S3 build cache if available.
#
#       Usage: run-rosetta [PKGSFILE]
#
# Performs three steps, in that order:
#
# 1. Run `rosetta extract` to read and translate all examples from all JSII
#    assemblies.
#
# 2. Run `rosetta infuse` to traverse all examples we have, and copy them
#    to classes that don't have an example yet.
#
# 3. Run `tools/@aws-cdk/generate-examples` to find all types that *still*
#    don't have examples associated with tme, and generate synthetic examples.
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
genexample_cache_opts=""
if [[ -f $rosetta_cache_file ]]; then
    rosetta_cache_opts="--cache-from ${rosetta_cache_file}"
    genexample_cache_opts="--cache-from ${rosetta_cache_file}"
fi

#----------------------------------------------------------------------

# Compile examples with respect to "decdk" directory, as all packages will
# be symlinked there so they can all be included.
echo "💎 Extracting code samples" >&2
$ROSETTA \
  --compile \
  --verbose \
  --output samples.tabl.json \
  $rosetta_cache_opts \
  --directory packages/decdk \
  $(cat $jsii_pkgs_file)

echo "💎 Infusing examples back into assemblies" >&2
$ROSETTA infuse \
  --verbose \
  samples.tabl.json \
  $(cat $jsii_pkgs_file)

echo "💎 Generating synthetic examples for the remainder" >&2
$scriptdir/../tools/@aws-cdk/generate-examples/bin/generate-examples \
  $genexample_cache_opts \
  --cache-to samples.tabl.json \
  $(cat $jsii_pkgs_file)

#----------------------------------------------------------------------

if [[ -d $(dirname $rosetta_cache_file) ]]; then
    # If the cache directory is available, copy the current tablet into it
    cp samples.tabl.json $rosetta_cache_file
fi
