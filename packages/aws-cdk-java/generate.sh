#!/bin/bash
set -euo pipefail
outdir="src/main"
rm -fr "${outdir}"
for p in $(find-jsii-packages -k jsii.names.java); do
    echo "Generating java code for module $p"
    jsii-pacmak --target java --outdir "${outdir}" $p
done

mkdir -p target
cp -f ../../node_modules/jsii-java-runtime/jsii-runtime-0.4.0.jar $PWD/target
