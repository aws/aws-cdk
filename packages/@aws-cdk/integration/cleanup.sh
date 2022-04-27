#!/bin/bash
# Script to clean stale .js and .d.ts files (that don't have a corresponding .ts
# file).

find test -name "integ.*.js" -delete
find test -name "integ.*.d.ts" -delete

for filename in $(find test \
     -type f \
     -name \*.js -o -name \*.d.ts); do

    if [[ $filename == *.d.ts ]]; then
        source=${filename%.d.ts}.ts
    else
        source=${filename%.*}.ts
    fi

    if [[ -f $source ]]; then
        rm $filename
        echo Removed $filename
    fi
done