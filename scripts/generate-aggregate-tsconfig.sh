#!/bin/bash
# Generate an aggregate tsconfig.json with references to all projects in the
# repository.
prefix="$(pwd)/"

echo '{'
echo '    "__comment__": "This file is necessary to make transitive Project References in TypeScript work",'
echo '    "files": [],'
echo '    "references": ['
comma='  '
for package in $(node_modules/.bin/lerna ls -ap); do
    if [[ -f ${package}/tsconfig.json ]]; then
        relpath=${package#"$prefix"}
        echo '        '"$comma"'{ "path": "'"$relpath"'" }'
        comma=', '
    fi
done
echo '    ]'
echo '}'
