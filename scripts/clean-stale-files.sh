#!/bin/bash
# Script to clean stale .js and .d.ts files (that don't have a corresponding .ts
# file).

for filename in $(find . \
     -not \( -name node_modules -prune \) \
     -not \( -name coverage -prune \) \
     -type f \
     -name \*.js -o -name \*.d.ts | git check-ignore --stdin); do

    if [[ $filename == *.d.ts ]]; then
        source=${filename%.d.ts}.ts
    else
        source=${filename%.*}.ts
    fi

    if [[ ! -f $source ]]; then
        rm $filename
        echo Removed $filename
    fi
done
