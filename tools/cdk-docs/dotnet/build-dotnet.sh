#!/bin/bash
set -euo pipefail
absname() {
    echo $(cd $(dirname $1) && pwd)/$(basename $1)
}

scriptdir=$(cd $(dirname $0) && pwd)
rootdir=$1
outdir=$(absname $2)

if [[ -d $outdir ]]; then
    echo "DotNet directory already exists; not rebuilding to save time." >&2
    echo "Run 'rm -rf $outdir' if you wish to rebuild." >&2
    exit 0
fi

if ! type mono > /dev/null; then
    echo "mono not installed. Not building TypeScript docs." >&2
    exit 1
fi

temproot=$(dirname $(mktemp -u))
tmpdir=$temproot/dotnet
rm -rf $tmpdir
mkdir -p $tmpdir

# Extract NUPKGs to get a set of DLLs
echo "Unpacking NUPKGs..." >&2
pkgdir=$tmpdir/nupkgs
mkdir -p $pkgdir
for pkg in $(find $1 -name \*.nupkg); do
    (
        abs=$(absname $pkg)
        cd $pkgdir
        unzip -qo $abs
    )
done

# The zips have been created with 0000 permissions for some reason.
# Fix that.
chmod -R 0755 $pkgdir

(
    cd $tmpdir

    # Initialize DocFx project here
    export SOURCEDIR=$pkgdir/src
    export OUTPUTDIR=$outdir
    $scriptdir/../docfx/docfx-prepare $scriptdir/docfx_project

    # Extract metadata
    $scriptdir/../docfx/docfx metadata
    $scriptdir/../docfx/docfx build
)
