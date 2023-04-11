#!/bin/bash
set -euo pipefail
scriptsdir=$(cd $(dirname $0) && pwd)
packagedir=$(cd ${scriptsdir}/.. && pwd)

# Output
OUTPUT_DIR="${packagedir}/schema"
mkdir -p ${OUTPUT_DIR}

# regenerate JSON schema and bumps the version
ts-node --prefer-ts-exts -e "require('${packagedir}/scripts/update-schema.ts').update()"
