#!/bin/bash
set -euo pipefail
lerna exec "$PWD/tools/cdk-build-tools/node_modules/.bin/jsii-fix-peers 2>/dev/null || true"