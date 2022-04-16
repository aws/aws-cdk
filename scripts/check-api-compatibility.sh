#!/bin/bash
# Check API compatibility of all packages
set -eu

repo_root="$(cd $(dirname $0)/.. && pwd)"
tmpdir=/tmp/compat-check

package_name() {
    node -pe "require('$1/package.json').name"
}

# Determine whether an NPM package exists on NPM
#
# Doesn't use 'npm view' as that is slow. Direct curl'ing npmjs is better
package_exists_on_npm() {
    pkg=$1
    ver=${2:-} # optional
    curl -I 2>/dev/null https://registry.npmjs.org/$pkg/$ver | head -n 1 | grep 200 >/dev/null
}

#----------------------------------------------------------------------

list_jsii_packages() {
    echo "Listing jsii packages..." >&2
    for dir in $(npx lerna ls -p); do
        if [[ -f $dir/.jsii ]]; then
            echo "$dir"
        fi
    done
}
jsii_package_dirs=$(list_jsii_packages)

#----------------------------------------------------------------------

# dirs_for_existing_pkgs DIRECTORY VERSION
#
# Input a directory and a version, output the directory IF it exists on NPM at that version
dirs_for_existing_pkgs() {
    local dir="$1"
    local ver="$2"
    if package_exists_on_npm $(package_name $dir) $ver; then
        echo "$dir"
        echo -n "." >&2
    else
        echo -n "x" >&2
    fi
}

export -f package_name
export -f package_exists_on_npm
export -f dirs_for_existing_pkgs

if ! ${SKIP_DOWNLOAD:-false}; then
    echo "Filtering on existing packages on NPM..." >&2

    echo "Determining baseline version... " >&2
    build_version=$(node -p 'require("./scripts/resolve-version.js").version')
    echo "Build version:    ${build_version}." >&2

    # Either called as:
    # - find-latest-release "<=2.14.0" (PR build); or
    # - find-latest-release "<=2.15.0-rc.0" (CI build); or
    # - find-latest-release "<=2.15.0" (release build)
    # all of which will find 2.14.0 as the version to compare against.
    version=$(node ./scripts/find-latest-release.js "<=${build_version}")
    echo "Released version: $version." >&2

    echo "Using version '$version' as the baseline..." >&2

    # Filter packages by existing at the target version
    existing_pkg_dirs=$(echo "$jsii_package_dirs" | xargs -n1 -P4 -I {} bash -c 'dirs_for_existing_pkgs "$@" "'$version'"' _ {})
    existing_names=$(echo "$existing_pkg_dirs" | xargs -n1 -P4 -I {} bash -c 'package_name "$@"' _ {})
    install_versions=$(for name in $existing_names; do echo "${name}@${version}"; done)
    echo " Done." >&2

    rm -rf $tmpdir
    mkdir -p $tmpdir

    echo "Installing from NPM..." >&2
    # Use npm7 instead of whatever the current NPM version is to make sure we
    # automatically install peer dependencies
    (cd $tmpdir && npx npm@^7.0.0 install --prefix $tmpdir $install_versions)
fi

#----------------------------------------------------------------------

echo "Checking compatibility..." >&2
success=true
for dir in $jsii_package_dirs; do
    name=$(package_name "$dir")
    if [[ ! -d $tmpdir/node_modules/$name ]]; then continue; fi
    if [[ ! -f $tmpdir/node_modules/$name/.jsii ]]; then continue; fi
    echo -n "$name... "
    if npx jsii-diff \
        --keys \
        --ignore-file ${repo_root}/allowed-breaking-changes.txt \
        $tmpdir/node_modules/$name \
        $dir \
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
