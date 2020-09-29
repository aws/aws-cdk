#!/bin/bash
set -euo pipefail

mkdir -p .tools
[[ ! -d .tools/git-secrets ]] && {
    echo "============================================================================================="
    echo "Downloading git-secrets..."
    (cd .tools && git clone --depth 1 https://github.com/awslabs/git-secrets.git)
}

# As the name implies, git-secrets heavily depends on git:
#
# a) the config is stored and fetched using 'git config'.
# b) the search is performed using 'git grep' (other search methods don't work
#    properly, see https://github.com/awslabs/git-secrets/issues/66)
#
# When we run in a CodeBuild build, we don't have a git repo, unfortunately. So
# when that's the case, 'git init' one on the spot, add all files to it (which
# because of the .gitignore will exclude dependencies and generated files) and
# then call 'git-secrets' as usual.
git rev-parse --git-dir > /dev/null 2>&1 || {
    git init --quiet
    git add -A .
}

# AWS config needs to be added to this repository's config
.tools/git-secrets/git-secrets --register-aws

.tools/git-secrets/git-secrets --scan
echo "git-secrets scan ok"
