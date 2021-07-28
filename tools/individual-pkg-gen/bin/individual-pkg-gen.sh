#!/bin/bash

set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

node $scriptdir/../gen-phase1.js
yarn lerna bootstrap
node $scriptdir/../gen-phase2.js
