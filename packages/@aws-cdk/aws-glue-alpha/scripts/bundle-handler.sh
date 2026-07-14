#!/bin/bash
set -euo pipefail

scriptdir=$(cd "$(dirname "$0")" && pwd)
packagedir=$(cd "$scriptdir/.." && pwd)

outdir="$packagedir/lib/partition-index-handler.bundle"
mkdir -p "$outdir"

esbuild=$(node -p "require.resolve('esbuild/bin/esbuild')")

"$esbuild" "$packagedir/lib/partition-index-handler/index.ts" \
  --bundle \
  --platform=node \
  --target=node18 \
  --format=cjs \
  --outfile="$outdir/index.js" \
  --minify
