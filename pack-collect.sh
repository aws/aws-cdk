#!/bin/bash
# Merges all files from all "dist/" directories under "packages/" into "./pack"
# Executed by pack.sh as a preparation for beta-bundle.sh
set -euo pipefail
mkdir -p pack
for dir in $(find packages -name dist | grep -v node_modules); do
  echo $dir
  rsync -av $dir/ pack/
done
