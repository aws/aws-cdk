#!/bin/bash

set -euo pipefail

directoryOfThisScript=$(cd $(dirname $0) && pwd)
echo "directoryOfThisScript: $directoryOfThisScript"
cp "$directoryOfThisScript/custom_command_handler.js" "$directoryOfThisScript/../custom_command_output/mylambdafile.js"
