#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash

header "--generate-only"

#------------------------------------------------------------------

echo "Trying --generate-only"

setup

cdk init -l javascript --generate-only

if [ -d .git ]
then
  fail "git shouldn't have been initialized"
fi
