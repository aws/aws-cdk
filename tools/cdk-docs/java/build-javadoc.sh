#!/bin/bash
set -euo pipefail

jarroot=$1
outputdir=$2

outdir="$2"
if [[ -d $outdir ]]; then
    echo "JavaDoc directory already exists; not rebuilding to save time." >&2
    echo "Run 'rm -rf $outdir' if you wish to rebuild." >&2
    exit 0
fi

if [[ ! -d $1 ]]; then
    echo "No JARs found. Not including JavaDocs." >&2
    exit 1
fi

if ! type javadoc > /dev/null; then
    echo "'javadoc' not installed. Not building JavaDocs." >&2
    exit 1
fi

mkdir -p $outdir

jars=$(find $1 -name \*.jar | tr '\n' ':')
javadoc -cp $jars -d $outdir -subpackages software.amazon.awscdk
