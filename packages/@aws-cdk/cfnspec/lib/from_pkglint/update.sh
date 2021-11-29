#!/bin/bash
set -euo pipefail
scriptdir="$(cd $(dirname $0) && pwd)"
files="readme-contents.ts aws-service-official-names.json"
source="${scriptdir}/../../../../../tools/@aws-cdk/pkglint"
for f in $files; do
  echo "Copying ${f}..."
  cp ${source}/lib/${f} ${scriptdir}
done