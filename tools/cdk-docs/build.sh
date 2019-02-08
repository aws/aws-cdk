#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

export args=""

build_javadoc() {
    if [[ ! -d $scriptdir/../../dist/java ]]; then
        echo "No JAVA binaries found. Not including JavaDocs." >&2
        return 0
    fi

    if ! type javadoc > /dev/null; then
        echo "javadoc not installed. Not building JavaDocs." >&2
        return 0
    fi

    export args="$args --javadoc /reference/javadoc"

    outdir=$scriptdir/website/static/reference/javadoc
    if [[ -d $outdir ]]; then
        echo "JavaDoc directory already exists; not rebuilding to save time." >&2
        echo "Run 'rm -rf $outdir' if you wish to rebuild." >&2
        return 0
    fi

    mkdir -p $outdir

    jars=$(find $scriptdir/../../dist/java -name \*.jar -printf '%p:')
    javadoc -cp $jars -d $outdir -subpackages software.amazon.awscdk

}

build_javadoc

(cd gen && tsc && npm run gen -- $args)
