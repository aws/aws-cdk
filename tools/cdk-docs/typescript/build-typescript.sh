#!/bin/bash
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
rootdir=$1
outdir="$2"

if [[ -d $outdir ]]; then
    echo "TypeScript directory already exists; not rebuilding to save time." >&2
    echo "Run 'rm -rf $outdir' if you wish to rebuild." >&2
    exit 0
fi

if ! type mono > /dev/null; then
    echo "mono not installed. Not building TypeScript docs." >&2
    exit 1
fi

if [[ ! -f $scriptdir/../docfx/docfx.exe ]]; then
    echo "DocFx not symlinked. Not building TypeScript docs." >&2
    exit 1
fi

cd $scriptdir

[[ -d node_modules ]] || npm install

tmpdir=$(mktemp -d)
trap "rm -rf $tmpdir" EXIT

absname() {
    echo $(cd $(dirname $1) && pwd)/$(basename $1)
}

# extract_docs TARBALL JSONDIR
extract_docs() {
    (
        abs=$(absname $1)
        mkdir -p $tmpdir/extract
        cd $tmpdir/extract
        rm -rf -- *
        tar xzf $abs
        # Every package has a directory called 'package'
        cd package
        cat <<EOF > api-extractor.json
{
  "\$schema": "https://developer.microsoft.com/json-schemas/api-extractor/api-extractor.schema.json",
  "compiler" : {
    "configType": "tsconfig",
    "rootFolder": "."
  },
  "apiReviewFile": { "enabled": false },
  "apiJsonFile": {
    "enabled": true,
    "outputFolder": "$2"
  },
  "project": {
    "entryPointSourceFile": "lib/index.d.ts"
  }
}
EOF
        $scriptdir/node_modules/.bin/api-extractor run || echo Finished with errors.
    )
}

# Collect API jsons to $tmpdir/api
mkdir -p $tmpdir/api
for tarball in $(find $1 -name \*.tgz); do
    extract_docs $tarball $tmpdir/api
done

# Convert API jsons to DocFX YAMLs
mkdir -p $tmpdir/yaml
$scriptdir/node_modules/.bin/api-documenter yaml -i $tmpdir/api -o $tmpdir/yaml

# Convert YAMLs to a reference
(
    cd $tmpdir
    cat <<EOF > docfx.json
{
  "build": {
    "content": [
      {
        "files": ["**/*.yml"],
        "src": "yaml",
        "dest": "api"
      }
    ],
    "dest": "$outdir"
  }
}
EOF
    mono $scriptdir/../docfx/docfx.exe build
)
