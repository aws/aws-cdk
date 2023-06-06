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

# Build noctilucent package
(
  # Check out the submodule if it's not there already
  if [ ! -f "vendor/noctilucent/Cargo.toml" ]; then
    git submodule update --init --recursive
  fi

  # Install wasm-pack if it's not there already
  if ! command -v wasm-pack >/dev/null 2>/dev/null; then
    cargo install wasm-pack
  fi

  pkgroot=$(cd $(dirname -- "$0") && pwd)

  cd vendor/noctilucent
  wasm-pack build --target nodejs                                               \
    --out-dir="${pkgroot}/lib/vendor/noctilucent"                               \
    --out-name=index                                                            \
    --features "${CDK_MIGRATE_NOCTILUCENT_FEATURES:-}"
)
