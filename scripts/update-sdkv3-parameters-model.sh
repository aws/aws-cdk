#!/bin/bash
set -eu
scriptdir=$(cd $(dirname $0) && pwd)
tmpdir=$(mktemp -d)
map_file="$tmpdir/map.json"
zip=https://github.com/aws/aws-sdk-js-v3/archive/refs/heads/main.zip
ziprootentry=aws-sdk-js-v3-main
target_file=packages/@aws-cdk/sdk-v2-to-v3-adapter/lib/parameter-types.ts
smithy_subdir=codegen/sdk-codegen/aws-models

# Use the GitHub feature to download a zip archive of the current state of a branch
# (Cloning --depth 1 takes about twice as long, cloning with full depth many minutes)
echo "⬇️ Downloading..."
curl -SfL -o $tmpdir/main.zip "$zip"
(cd $tmpdir && unzip -q main.zip)

echo "🖨️ Generating..."
npx ts-node $scriptdir/update-sdkv3-parameters-model.ts $tmpdir/$ziprootentry/$smithy_subdir > "$target_file"

echo "🚮 Cleaning up..."
rm -rf $tmpdir

echo "✅ Done."
