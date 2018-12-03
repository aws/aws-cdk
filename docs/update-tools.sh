#!/bin/bash
# Script to update tools topic
set -euo pipefail
cd src

rm cdk_help.txt 2> /dev/null

echo ".. code-block:: sh" > cdk_help.txt
echo "" >> cdk_help.txt

cdk --help | sed 's/^/    /' >> cdk_help.txt
