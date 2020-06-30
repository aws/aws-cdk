#!/bin/bash
#--------------------------------------------------------------------------
# Add a statement to all .npmignore files under the root of the repository.
# This can called manually when needed.
#------------------------------------------------------------------------

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
rootdir=${scriptdir}/..

cd ${rootdir}

statement=${1:-}

if [ -z ${statement} ]; then
  echo "Usage: add-npm-ignore.sh STATEMENT"
  exit 1
fi

npm_ignore_files=$(find . -name '*.npmignore' | grep -v node_modules)

for ignore in ${npm_ignore_files}; do
  echo ${statement} >> ${ignore}
done