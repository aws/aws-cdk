#!/bin/bash
set -euo pipefail

if [ $# != 2 ]; then
    echo error: $*
    echo usage $0 "old" "new"
    exit 1
fi

YEAR_OLD=$1
YEAR_NEW=$2

WORKDIR=$(cd $(dirname $0) && cd ../)

LICENSES=`find ${WORKDIR} -name "LICENSE" |grep -v "node_modules"`
NOTICES=`find ${WORKDIR} -name "NOTICE" |grep -v "node_modules"`

COPYRIGHT_OLD="Copyright 2018-${YEAR_OLD} Amazon.com, Inc. or its affiliates. All Rights Reserved."
COPYRIGHT_NEW="Copyright 2018-${YEAR_NEW} Amazon.com, Inc. or its affiliates. All Rights Reserved."

for item in "${LICENSES[@]}" "${NOTICES[@]}"
do
    echo ${item}
    sed -i -e "s/${COPYRIGHT_OLD}/${COPYRIGHT_NEW}/g" ${item}
done