#!/bin/bash
#---------------------------------------------------------------------------------------------------
# executes unit tests
#
# prepares a staging directory with the requirements
set -e
script_dir=$(cd $(dirname $0) && pwd)

# prepare staging directory
staging=$(mktemp -d)
mkdir -p ${staging}
cd ${staging}

# copy src and overlay with test
cp ${script_dir}/../../lib/extensions/queue/lambda/queue_backlog_calculator.py $PWD
cp ${script_dir}/test_index.py $PWD
cp ${script_dir}/Dockerfile $PWD

docker build .