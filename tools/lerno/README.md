lerno
=====

A caching build tool for NodeJS monorepos.

## Usage

Run this in the root of the repository to do the build, quicker:

```
tools/lerno/bin/lerno
```

## How it works

For every package in the monorepo (currently using `lerna ls` to detect the
packages), figure out the source files and the dependencies, and then hash those
to determine if the build is stale or a cached result can be reused.

Source files are determined by skipping `node_modules` outright, and
using `.gitignore` patterns for the rest.

The command that is run is `yarn build+test`, but can be configured
by passing `--command`.

The entire contents of the package directory (again, except the `node_modules`
directory) are saved as the results of the build (results that would be restored
upon a cached build).

Some shortcuts have been taken which seem to be safe for our current
monorepo setup. As such, this tool is still experimental, and should
probably not be used on a build servers yet, just to speed up local
developer builds.



Cached files are stored in `~/.cache/lerno`.
