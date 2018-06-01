#!/bin/bash
set -euo pipefail
outdir="src/main/java"
rm -fr "${outdir}"
for p in $(find-jsii-packages -k jsii.names.java); do
    echo "Generating java code for module $p"
    jsii-pacmak --target java --outdir "${outdir}" $p
done
