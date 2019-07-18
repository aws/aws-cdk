#!/bin/bash
#------------------------------------------------------------------
# setup
#------------------------------------------------------------------
set -e
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/../common/util.bash
header Python
prepare_toolkit
#------------------------------------------------------------------

for template in app sample-app; do
    echo "Trying template $template"
    # Provide a template otherwise mktemp might generate a name like
    # 'tmp.AFCVIQ' which the Python init template REALLY doesn't like.
    cd $(mktemp -d /tmp/pythonXXXXXXX)

    cdk init -l python $template

    source .env/bin/activate
    pip_install_r requirements.txt
    cdk synth
done
