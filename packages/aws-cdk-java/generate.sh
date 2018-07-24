#!/bin/bash
set -euo pipefail

mkdir -p project

# deploy jsii-runtime to the local maven repo so it will be discoverable
jsii_runtime_repo=$(node -e "console.log(path.join(path.dirname(require.resolve('jsii-java-runtime/package.json')), 'maven-repo'))")
rm -fr ~/.m2/repository/com/amazonaws
mkdir -p ~/.m2/repository
rsync -av ${jsii_runtime_repo}/ ~/.m2/repository/

echo "Generating pom.xml..."
node ./pom.xml.t.js > project/pom.xml

outdir="project/src/main"
rm -fr "${outdir}"
for p in $(find-jsii-packages -k jsii.targets.java); do
    echo "Generating java code for module $p"
    jsii-pacmak --target java --outdir "${outdir}" $p
done

