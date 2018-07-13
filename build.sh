#!/bin/bash
set -euo pipefail

if [ ! -d node_modules ]; then
    /bin/bash ./install.sh
fi

BUILD_INDICATOR=".BUILD_COMPLETED"
rm -rf $BUILD_INDICATOR

export PATH=node_modules/.bin:$PATH

echo "============================================================================================="
echo "building..."
lerna --reject-cycles exec --stream "npm run build"

echo "============================================================================================="
echo "testing..."
lerna run --stream test

touch $BUILD_INDICATOR


