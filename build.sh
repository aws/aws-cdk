#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    /bin/bash ./install.sh
fi

export PATH=node_modules/.bin:$PATH

echo "============================================================================================="
echo "boostrapping..."
lerna bootstrap --reject-cycles --loglevel=debug

echo "============================================================================================="
echo "testing..."
lerna run test --stream


