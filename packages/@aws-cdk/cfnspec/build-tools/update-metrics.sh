#!/bin/bash
set -eu

explorer_tarball="$1"

target_file=lib/canned-metrics/services.json

mkdir -p $(dirname $target_file)

tar xzOf "$explorer_tarball" "package/dist/lib/configuration/generated/services.json" > $target_file.json
node -p "JSON.stringify(require('./${target_file}.json'), undefined, 2)" > $target_file
rm $target_file.json
echo "Wrote $target_file"
