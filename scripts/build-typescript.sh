#!/bin/bash
set -euo pipefail
scriptdir="$(cd $(dirname $0) && pwd)"
${scriptdir}/generate-aggregate-tsconfig.sh > ${scriptdir}/../tsconfig.json
cd ${scriptdir}/..
node_modules/.bin/tsc -b "$@"
