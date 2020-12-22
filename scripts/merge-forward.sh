#!/bin/bash
# Forward merge 'master' branch into 'v2-main' branch

set -exo pipefail

git fetch --all
git checkout -B v2-main origin/v2-main

# Some package rules differ between v1 and v2, most notably which packages can be public vs private.
# These differences are fixable via 'pkglint', so we run that and commit the delta (if any).
lerna run pkglint && { git diff --quiet || git commit -am 'automatic pkglint fixes'; }

git merge origin/master --no-edit
