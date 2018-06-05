#!/bin/bash

# HACK: lerna needs a git repo to work but publish will work nevertheless
git init
version="$(node -e "console.log(require('./lerna.json').version)")"
exec node_modules/.bin/lerna publish --skip-git --skip-npm --repo-version=${version}-pre+${CODEBUILD_RESOLVED_SOURCE_VERSION:0:7} --yes
