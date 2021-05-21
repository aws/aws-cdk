#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

# Download (parts of) the cfn-lint repo that we use to enhance our model
intermediate="$(mktemp -d)/tmp.zip"

url="https://github.com/aws-cloudformation/cfn-lint/archive/master.zip"
echo >&2 "Downloading from ${url} ..."
curl -sSfL "${url}" -o ${intermediate}

for file in StatefulResources; do
  echo >&2 "${file}.json"
  mkdir -p "spec-source/cfn-lint/${file}"
  unzip -p "${intermediate}" cfn-lint-master/src/cfnlint/data/AdditionalSpecs/${file}.json > spec-source/cfn-lint/${file}/000.json
done

echo >&2 "Done."
