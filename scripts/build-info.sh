#!/bin/bash
set -euo pipefail

filename=$1

commit=${CODEBUILD_RESOLVED_SOURCE_VERSION:-}
# CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local build or CodePipeline build),
# use the HEAD commit hash
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > "$filename" <<HERE
{
  "comment": "Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ") by build-info.sh",
  "commit": "${commit:0:7}"
}
HERE
