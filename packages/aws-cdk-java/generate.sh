#!/bin/bash
set -euo pipefail
outdir="src/main"
rm -fr "${outdir}"
for p in $(find-jsii-packages -k jsii.names.java); do
    echo "Generating java code for module $p"
    jsii-pacmak --target java --outdir "${outdir}/java" $p
done

# Moving the "resources" folder where mvn expects it to be...
[ -d ${outdir}/java/resources ] && mv ${outdir}/java/resources ${outdir}/resources

mkdir -p target

cp -f $(node -e 'console.log(path.dirname(require.resolve("jsii-java-runtime/package.json")));')/target/jsii-runtime-0.4.0.jar $PWD/target
