#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    /bin/bash ./install.sh
fi

BUILD_INDICATOR=".BUILD_COMPLETED"
rm -rf $BUILD_INDICATOR

export PATH=node_modules/.bin:$PATH

echo "============================================================================================="
echo "boostrapping..."
lerna bootstrap --reject-cycles

echo "============================================================================================="
echo "testing..."
lerna run test --stream

touch $BUILD_INDICATOR


