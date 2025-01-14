#!/bin/bash
set -euo pipefail

aws_cdk="$1"

# Copy the various resource files from the CLI
cp -R $aws_cdk/resources ./resources
cp $aws_cdk/lib/index_bg.wasm ./lib/
cp $aws_cdk/build-info.json ./
cp $aws_cdk/db.json.gz ./
