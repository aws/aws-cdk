#!/bin/bash
# Check API compatibility of all packages
set -eu

scope=""
while [[ "${1:-}" != "" ]]; do
    case $1 in
        -h|--help)
            echo "Usage: check-api-compatibility.sh [--scope <package-name>]"
            exit 1
            ;;
        --scope)
            scope="--scope $2"
            shift
            ;;
        *)
            echo "Unrecognized parameter: $1"
            exit 1
            ;;
    esac
    shift
done

repo_root="$(cd $(dirname $0)/.. && pwd)"
tmpdir=/tmp/compat-check

package_name() {
    node -pe "require('$1/package.json').name"
}

#----------------------------------------------------------------------

echo "Listing packages..." >&2
package_dirs=()
package_names=()
for dir in $(npx lerna ls -p $scope); do
    if [[ -f $dir/.jsii ]]; then
        package_dirs+=("$dir")
        package_names+=("$(package_name $dir)")
    fi
done

#----------------------------------------------------------------------

if ! ${SKIP_DOWNLOAD:-false}; then
    echo "Filtering on existing packages on NPM..." >&2
    for i in ${!package_dirs[@]}; do
        echo -n "${package_names[$i]}... "
        if npm view --loglevel silent ${package_names[$i]} > /dev/null; then
            echo "Exists."
        else
            echo "NEW."
            unset 'package_names[i]'
            unset 'package_dirs[i]'
        fi
    done

    rm -rf $tmpdir
    mkdir -p $tmpdir

    echo "Installing from NPM..." >&2
    (cd $tmpdir && npm install --prefix $tmpdir ${package_names[@]})
fi

#----------------------------------------------------------------------

# get the current version from Lerna
current_version=$(npx lerna ls -pl $scope | head -n 1 | cut -d ':' -f 3)

echo "Checking compatibility..." >&2
success=true
for i in ${!package_dirs[*]}; do
    if [[ ! -d $tmpdir/node_modules/${package_names[$i]} ]]; then continue; fi
    echo -n "${package_names[$i]}... "
    if npx jsii-diff \
        --keys \
        --ignore-file ${repo_root}/allowed-breaking-changes.txt \
        $tmpdir/node_modules/${package_names[$i]} \
        ${package_dirs[$i]} \
        2>$tmpdir/output.txt; then
        echo "OK."
    else
        success=false
        echo "CHANGES."
        cat $tmpdir/output.txt
    fi
done

if $success; then
    echo "All OK." >&2
else
    echo "Some packages seem to have undergone breaking API changes. Please avoid." >&2

    exit 1
fi
