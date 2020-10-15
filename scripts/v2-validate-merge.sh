#!/bin/sh
# Run as part of Github action validate-v2-merge-forward.

commit=$(git rev-parse HEAD)
git checkout -b v2-main origin/v2-main
git merge $commit --no-edit

if [ $? -ne 0 ]; then
  echo "::error ::Merge conflicts detected against v2-main branch. Try to avoid."
  echo "::error ::See above for conflicting files. If unavoidable, add the 'pr/exempt-merge-conflict' label"
fi