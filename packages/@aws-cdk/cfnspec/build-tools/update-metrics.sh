#!/bin/bash
set -eu

explorer_tarball="$1"

target_file=lib/canned-metrics/services.json

mkdir -p $(dirname $target_file)

tar xzOf "$explorer_tarball" "package/dist/lib/configuration/generated/services.json" > $target_file
echo "Wrote $target_file"
