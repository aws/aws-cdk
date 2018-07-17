#!/bin/bash
set -euo pipefail

mkdir -p .tools
[[ ! -d .tools/git-secrets ]] && {
    echo "============================================================================================="
    echo "Downloading git-secrets..."
    (cd .tools && git clone --depth 1 https://github.com/awslabs/git-secrets.git)
}

.tools/git-secrets/git-secrets --scan
