#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
source ${scriptdir}/common.bash
# ----------------------------------------------------------

tmpdir=$(dirname $(mktemp -u))
casmdir=$tmpdir/cdk-integ-cx
stderrfile=$casmdir/cdk.err

# Copy the files from a cloud assembly source dir into the
# tempdir. Evaluate .js files found their (interpret them
# as templates).
function prepare_cloud_assembly() {
    local asmdir=$1
    echo "ASSEMBLY ${asmdir}"
    rm -rf $casmdir
    mkdir -p $casmdir
    cp -R $asmdir/* $casmdir

    # Execute templates to produce file with the same name
    # but without .js extension
    shopt -s nullglob
    for template in $casmdir/*.js; do
        node $template > ${template%.js}
    done
}

# Assert that there was no providerError in CDK's stderr
# Because we rely on the app/framework to actually error in case the
# provider fails, we inspect the logs here.
function assert_no_error() {
    local asmdir=$1

    if grep '$providerError' $stderrfile; then
        cat $stderrfile >&2
        echo "There was an error executing the context provider for assembly ${asmdir}!" >&2
        exit 1
    fi
}

# Echo the TEST_ACCOUNT, TEST_REGION vars to make bash abort if they're not set.
echo "Running backwards compatibility test (account ${TEST_ACCOUNT}, region ${TEST_REGION})"

for assembly in ${scriptdir}/cloud-assemblies/*; do
    prepare_cloud_assembly $assembly

    rm -f cdk.context.json
    cdk -a $casmdir -v synth > /dev/null 2> $stderrfile

    assert_no_error $assembly
done

echo "✅  success"
