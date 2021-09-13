#!/bin/bash

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

node $scriptdir/../copy-files-removing-deps.js
yarn lerna bootstrap
node $scriptdir/../restore-package-jsons.js
