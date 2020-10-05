#!/bin/bash
set -euo pipefail

# given an aws-cdk bundle archive (the one published to github releases), extract
# all .jsii manifests and places them under "jsii/*.jsii"
# now they can be used with jsii-reflect

zip=${1:-}
if [ -z "${zip}" ]; then
  echo "Usage: $(basename $0) <cdk-bundle-zip>"
  exit 1
fi

outdir=$PWD/jsii
rm -fr ${outdir}
mkdir -p ${outdir}

workdir=$(mktemp -d)
(cd ${workdir} && unzip -q ${zip} js/*)

for tarball in $(find ${workdir} -name *.jsii.tgz); do
  basename=$(basename ${tarball} .jsii.tgz)
  (
    staging=$(mktemp -d)
    cd ${staging}
    if tar -xzv --strip-components=1 -f ${tarball} package/.jsii 2> /dev/null; then
      echo ${basename}
      mv .jsii ${outdir}/${basename}.jsii
    fi
    rm -fr ${staging}
  )
done
