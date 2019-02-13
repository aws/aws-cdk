#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

javadocdir=$scriptdir/website/static/reference/javadoc
typescriptdir=$scriptdir/website/static/reference/typescript

$scriptdir/javadoc/build-javadoc.sh $scriptdir/../../dist/java $javadocdir
$scriptdir/typescriptref/build-typescript.sh $scriptdir/../../dist/js $typescriptdir

args=""
if [[ -d $javadocdir ]]; then args="--javadoc $javadocdir"; fi

(cd gen && tsc && npm run gen -- $args)
