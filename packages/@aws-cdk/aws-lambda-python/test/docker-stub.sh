#!/bin/bash
set -euo pipefail

# stub for the `docker` executable. it is used as CDK_DOCKER when executing unit
# tests in `layer.test.ts` It outputs the command line to
# `/tmp/docker-stub.input` and mimics to a small extent what docker does when
# building bundler images and bundling based on command line arguments

echo "$@"
echo "$@" >> /tmp/docker-stub.input

if echo "$@" | grep "^build"; then
  # Emit an image id
  echo "sha256:1234567890abcdef"
  exit 0
fi

if echo "$@" | grep "^run.*/asset-output"; then
  # Output an asset
  outdir=$(echo "$@" | xargs -n1 | grep "/asset-output" | head -n1 | cut -d":" -f1)
  touch ${outdir}/test.txt
  exit 0
fi

echo "Unsupported command"
exit 1
