# How this package is built

This package is built by copying the sources from `@aws-cdk/assert` and
transforming the imports to depend on the v2 library, `aws-cdk-lib`, instead.

Publishing of this package will only happen on the v2 branch. Just before
publishing, we twiddle the `package.json` in the tarball and change the
package name from `@aws-cdk/assert2` to `@aws-cdk/assert`, so that this
package will be published under the right name, for consumption by users when
they are interacting with CDKv2. On that branch, we're not publishing the
ORIGINAL `assert` package, so there is no conflict.

(We MUST only do this package name twiddling at the very last moment, otherwise
Yarn Workspaces is going to complain that multiple packages have the same name.)

This package is `private` for v1 and `public` for v2, and must be
excluded from `ubergen`.

## Why not just...?

### ...transform the `assert` package at build time?

Not that easy -- the *dependencies* of the `assert` package need to change.
They need to go from depending on `@aws-cdk/core` to `aws-cdk-lib`.

Since our "source of truth" for dependencies and build system is our network
of `package.json`s, which are interpreted by Yarn before any build step is
even executed, we won't be able to change the `package.json` during the
build.

### ...commit the code for the v2 version of `assert` on the v2 branch, and deal with the occasional potential new feature as a forward-merge conflicts?

Actually, the v2 build needs to have BOTH flavors of the `assert` package
available in parallel... so we also need two copies of the package directory
on disk.

That's because the individual packages are built and tested using
`assert`. Only after all that is done, we package and build the
monopackage from all those individual package, and after that can we build
`assert2` (and publish it as `@aws-cdk/assert`).
