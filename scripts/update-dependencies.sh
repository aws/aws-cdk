#!/bin/bash
set -euo pipefail

export NODE_OPTIONS="--max-old-space-size=8196 ${NODE_OPTIONS:-}"

#----------------------------------------------------------------------
# PARSE ARGS

mode="semver"
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            mode="$2"
            shift
            ;;
        -h|--help)
            echo "Usage: update-dependencies [--mode semver|full]" >&2
            exit 1
            ;;
        *)
            echo "Unrecognized argument: $1" >&2
            exit 1
            ;;
    esac
    shift
done

if [[ $mode != 'semver' && $mode != 'full' ]]; then
    echo "--mode should be 'semver' or 'full'" >&2
    exit 1
fi

#----------------------------------------------------------------------
# MAIN

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Hide all local packages from all package.jsons so nothing is going to touch
# them while updating. Don't do relative URLs because otherwise transitive
# dependencies will be cached in every individual package.
echo ">> Hiding local package.json references."
$script_dir/swizzle-package-json.py hide

restore_package_jsons() {
    echo ">> Restoring package.json references."
    $script_dir/swizzle-package-json.py restore
}
# If we abort early, don't forget to reset package.jsons
trap restore_package_jsons EXIT

echo "Updating dependencies using --mode $mode"

case $mode in
    semver)
        # NPM update respects semver
        npm update --dev
        npx lerna exec -- npm update --dev
        ;;

    full)
        # Sometimes package-lock.json and node_modules contains detritus that causes problems.
        # Get rid of it them completely.
        npx -p npm-check-updates ncu -x @types/node -u && rm -Rf package-lock.json node_modules && npm install && npm install --save-dev @types/node@8 && npm audit fix
        npx lerna exec -- npx -p npm-check-updates ncu -x @types/node -u
        npx lerna exec -- rm -Rf package-lock.json node_modules
        npx lerna exec -- npm install
        npx lerna exec -- npm audit fix
        ;;
esac

# Restore package.jsons to original versioned references, restored removed
# symlinks using lerna.
restore_package_jsons
trap '' EXIT
npx lerna link

echo "DONE. Doing a validating build..."
npx lerna run --stream build

# Doing a full test. Must do it here instead of per-package since our tooling
# makes a number of assumptions on the format of package.json which does not
# include supporting "file:..." references.
echo "DONE. Doing a validation test run..."
npx lerna run --stream test
