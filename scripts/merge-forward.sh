#!/bin/bash
# Forward merge 'master' branch into 'v2-main' branch

set -exo pipefail

git fetch --all

# create 'v2-main' if it does not already exist
(git branch --list | grep 'v2-main') || git checkout -b v2-main origin/v2-main

git checkout v2-main
git merge origin/master --no-edit
