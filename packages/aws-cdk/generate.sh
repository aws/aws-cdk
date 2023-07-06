#!/bin/bash
set -euo pipefail

commit=${CODEBUILD_RESOLVED_SOURCE_VERSION:-}
# CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local build or CodePipeline build),
# use the HEAD commit hash
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > build-info.json <<HERE
{
  "comment": "Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ") by generate.sh",
  "commit": "${commit:0:7}"
}
HERE

# Download noctilucent wasm-pack build
NOCTILUCENT_VERSION=0.1.2
PACK_URL=https://github.com/iph/noctilucent/releases/download/v${NOCTILUCENT_VERSION}/wasm-pack.zip
outdir=lib/vendor/noctilucent

mkdir -p $outdir
(cd $outdir && curl -sSfLo wasm-pack.zip "$PACK_URL" && unzip -o wasm-pack.zip)

# Don't need these files
rm $outdir/{.gitignore,README.md,package.json,wasm-pack.zip}
