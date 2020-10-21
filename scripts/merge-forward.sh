#!/bin/bash
# Forward merge 'master' branch into 'v2-main' branch

set -exo pipefail

git fetch --all
git checkout -B v2-main origin/v2-main

if [ -z $PR_VALIDATION ]; then
  from='origin/master'
  unset -e
else
  from=$(git rev-parse HEAD)
fi

git merge $from --no-edit

if [ $? -ne 0 ]; then
  echo "::error ::Merge conflicts detected against v2-main branch. Try to avoid."
  echo "::error ::See above for conflicting files. If unavoidable, add the 'pr/exempt-merge-conflict' label"
  exit 1
fi
