#!/bin/bash
# creates symlinks under node_modules for all packages in this repo
# can be used to work against this code base.
set -euo pipefail
root="$(cd $(dirname $0) && pwd)"

modules="$(find ${root}/packages -name package.json | grep -v node_modules | grep -v init-templates | xargs -n1 dirname)"
for module in ${modules}; do
  echo "${module} => node_modules/$(basename ${module})"
  ln -s ${module} node_modules/
done
