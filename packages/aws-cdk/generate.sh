#!/bin/bash
set -euo pipefail

commit=${CODEBUILD_RESOLVED_SOURCE_VERSION:-}
# CODEBUILD_RESOLVED_SOURCE_VERSION is not defined (i.e. local build or CodePipeline build),
# use the HEAD commit hash
if [ -z "${commit}" ]; then
  commit="$(git rev-parse --verify HEAD)"
fi

cat > lib/version.ts <<HERE
// Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ") by generate.sh

/** The qualified version number for this CDK toolkit. */
// tslint:disable-next-line:no-var-requires
export const VERSION = \`\${require('../package.json').version.replace(/\\+[0-9a-f]+\$/, '')} (build ${commit:0:7})\`;
HERE
