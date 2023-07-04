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

# Build noctilucent package in a Docker/Finch VM
NOCTILUCENT_GIT="https://github.com/iph/noctilucent.git"
NOCTILUCENT_COMMIT_ID="6da7c9fade55f8443bba7b8fdfcd4ebfe5208fb1"
if [ "$(cat lib/vendor/noctilucent/.version 2>/dev/null || echo '')" == "${NOCTILUCENT_GIT}:${NOCTILUCENT_COMMIT_ID}" ]
then
  echo "⏭️ Noctilucent WASM binary is up-to date, skipping build..."
  echo "ℹ️ Delete lib/vendor/noctilucent/.version to force a rebuild."
else
  echo "⏳ Building Noctilucent WASM binary for embedding... This will take a while..."
  ${CDK_DOCKER:-docker} build --rm                                              \
    --build-arg NOCTILUCENT_GIT="${NOCTILUCENT_GIT}"                            \
    --build-arg NOCTILUCENT_COMMIT_ID="${NOCTILUCENT_COMMIT_ID}"                \
    --file lib/vendor/noctilucent/Dockerfile                                    \
    --target wasm                                                               \
    --output type=tar,dest=lib/vendor/noctilucent/noctilucent.tar               \
    lib/vendor/noctilucent
  tar -C lib/vendor/noctilucent -xvf lib/vendor/noctilucent/noctilucent.tar
fi
