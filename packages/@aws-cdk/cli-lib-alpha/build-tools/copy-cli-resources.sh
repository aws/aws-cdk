#!/bin/bash
set -euo pipefail

aws_cdk="$1"

# Copy all resources that aws_cdk/generate.sh produced, and some othersCall the generator for the
cp $aws_cdk/build-info.json ./
cp -R $aws_cdk/lib/init-templates ./lib/

mkdir -p ./lib/api/bootstrap/ && cp $aws_cdk/lib/api/bootstrap/bootstrap-template.yaml ./lib/api/bootstrap/
cp $aws_cdk/lib/index_bg.wasm ./lib/
cp $aws_cdk/db.json.gz ./
