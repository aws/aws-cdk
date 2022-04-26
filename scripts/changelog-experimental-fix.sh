#!/bin/bash
set -euo pipefail
changelog="${1:-}"

if [ -z "${changelog}" ]; then
  echo "Usage: $0 CHANGELOG.md"
  exit 1
fi

sed -i.tmp -e 's/BREAKING CHANGES$/BREAKING CHANGES TO EXPERIMENTAL FEATURES/' ${changelog}
rm ${changelog}.tmp
