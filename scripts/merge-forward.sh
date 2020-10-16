#!/bin/bash
# Forward merge 'master' branch into 'v2-main' branch

set -exo pipefail

git checkout -b v2-main origin/v2-main
git merge master --no-edit