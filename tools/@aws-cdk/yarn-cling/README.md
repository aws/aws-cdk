# yarn-cling

Generate an NPM shrinkwrap file from a yarn-managed monorepo.

## Why do we need an NPM shrinkwrap file?

When vending JavaScript applications that are installed via NPM, an
`npm-shrinkwrap.json` is necessary to control the dependency tree of the
installed application, ensuring that all the dependencies have the
version that the application vendor expects.

1. This prevents `npm install <application>` on the user's computer
   from installing an untested combination of versions, one that may potentially
   be broken. This *shouldn't* happen if everyone nicely keeps to semantic
   versioning, but doing so relies on good intentions.

2. Since most package's dependencies are written like `^1.2.0`, any application
   in the NPM ecosystem can potentially be compromised by someone releasing a
   minor or patch version of a library somewhere deep in the dependency tree
   with malware in it. All subsequent `npm install <application>`s would happily
   install the new version of the now compromised library.

The only way around both of these issues is an `npm-shrinkwrap.json`, which will
be respected by NPM on doing `npm install` (unlike `package-lock.json`, which
won't).

Note that yarn doesn't support shrinkwrapping at all. We can't help those
people, but we can at least protect NPM users and tell people to use NPM to
install our applications if they want to have some semblance of installation
safety.

## Okay fine. Why does this tool need to exist?

There doesn't seem to be any existing tool that can generate the
`npm-shrinkwrap.json` file from our monorepo.

### What about 'npm shrinkwrap' ?

There is the command `npm shrinkwrap`. From various Googles, this command
varyingly used to accept arguments and not accept arguments. Its current
incarnation on my NPM (6.11.3) does not accept arguments, and simply
renames `package-lock.json => npm-shrinkwrap.json`. We don't have
a `package-lock.json` (because we manage our monorepo completely using
Yarn), so that obviously won't work.

Nevertheless, if I run `npm shrinkwrap` a file IS generated. This file
contains SOME version information, but doesn't contain package integrity
checksums and breaks NPM when a subsequent `npm install` is run. NPM
exits with `npm ERR! Cannot read property 'match' of undefined`.

### What about 'synp' ?

There is a tool called synp which can convert `yarn.lock` to `package-lock.json`
(which is the same format as `npm-shrinkwrap.json`).

Unfortunately, we only have one `yarn.lock` for the whole monorepo, whereas we
would need the subset of dependencies `yarn.lock` that apply to the application
we're trying to bundle.

This tool does some inspired borrowing from `synp` but is monorepo-aware.

## How does it work?

Requires the monorepo dependency tree to have been bootstrapped, so that
we can look at the concrete `node_modules` directories of all packages involved
(because we need each package's `package.json` to separate production dependencies
from devDependencies).

For all (production) dependencies of the package we're shrinkwrapping:

- If the dependency is in `yarn.lock`, yarn resolved the version for us and
  we copy that entry into the package lock file.
- If the dependency is not in `yarn.lock`, the dependency comes from the monorepo
  and will be released at the same time as the current package. Unfortunately,
  since it hasn't been downloaded yet we won't have an integrity for it. We simply
  add an entry that contains the version number to the package lock.

Recurse from the dependency's package directory.