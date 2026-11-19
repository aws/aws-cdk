#!/bin/bash
# Script to clean stale files in the repo that will cause rebuild problems after a
# branch switch.
cd $(git rev-parse --show-toplevel)

# I don't trust the .nx cache well enough
rm -rf .nx

echo I.

# Delete all directories that no longer have any tracked files in them
# (Could include ignored files)
for dir in $(git ls-files --others --directory -x node_modules | grep '/$'); do
  rm -rf $dir
  echo Removed $dir
done

echo II.

# .js and .d.ts files (that don't have a corresponding .ts file)
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

echo III.

# Remove .tsbuildinfo files that sometimes prevent a .ts rebuild if timestamps
# haven't changed.
for filename in $(find . -name \*.tsbuildinfo); do
  rm $filename
  echo Removed $filename
done

# Stop the NX daemon
npx nx reset || exit 128

# Reinstall all dependencies
nice yarn || {
  # Sometimes yarn just has problems, kill node_modules and try again
  rm -rf node_modules
  nice yarn || exit 128
}
