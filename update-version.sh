#!/bin/bash

# HACK: lerna needs a git repo to work but publish will work nevertheless
git init
exec node_modules/.bin/lerna publish --skip-git --skip-npm --repo-version=0.6.0-pre+${CODEBUILD_RESOLVED_SOURCE_VERSION:0:7} --yes
