#!/bin/bash
set -euo pipefail

mkdir -p project

echo "Generating pom.xml..."
node ./pom.xml.t.js > project/pom.xml

outdir="project/src/main"
rm -fr "${outdir}"
for p in $(find-jsii-packages -k jsii.names.java); do
    echo "Generating java code for module $p"
    jsii-pacmak --target java --outdir "${outdir}" $p
done

