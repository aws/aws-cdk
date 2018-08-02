#!/bin/bash
# Merges all files from all "dist/" directories under "packages/" into "./pack"
# Executed by pack.sh as a preparation for beta-bundle.sh
set -euo pipefail
target="pack"
mkdir -p ${target}
for dir in $(find packages -name dist | grep -v node_modules); do
  echo "Merging ${dir} into ${target}"
  rsync -av $dir/ ${target}/
done
