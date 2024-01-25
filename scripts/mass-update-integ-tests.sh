#!/bin/bash
set -eu
npx integ-runner --directory packages --update-on-failed --disable-update-workflow "$@"
