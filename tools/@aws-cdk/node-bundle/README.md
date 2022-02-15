# node-bundle

Create bundled packages with zero dependencies and appropriate license attributions.

## Why

When shipping nodejs applications, there is currently no easy way to ensure your users are
consuming the exact dependency clojure your package was tested against.

This is because many libraries define their dependencies with a range, rather then a fixed version.
NPM has provided an install time lock file called [shrinkwrap](https://docs.npmjs.com/cli/v8/commands/npm-shrinkwrap)
to mitigate this, however, this file is only respected by NPM itself, and not by other package managers such as Yarn.

## What

This package wires up several popular tools to offer a simple entrypoint for
creating self-contained nodejs packages.

The resulting packages are still npm installable packages, but the entrypoints you specify are
replaced with a bundled version of them, embedding all their dependencies inline.
Note that embedding dependencies means you are effectively redistributing third-party software.
This has legal implications, since it requires proper attribution
of those dependencies, validating their licenses allow such redistribution.

This tool takes care of all that:

- Bundle dependencies inside the package.

  > This is currently done with [esbuild](), but is subject to change.

- Validate and create NOTICE files with complete third-party attributions.

  > This is currently done with [license-checker](https://www.npmjs.com/package/license-checker), but is subject to change.

- Enforce no circular imports are exhibited in your package, nor in your dependency clojure.

  > This is currently done with [madge](https://www.npmjs.com/package/madge), but is subject to change.

## Alternative Approaches

We considered two other alternatives before eventually going down this route:

### Bundled Dependencies

Aside from a shrinkwrap file, NPM also offers a feature called `bundledDependencies`
to vendor in your dependencies inside the `node_modules` directory of your package.

> See [bundledDependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bundleddependencies)

While this approach seems to be supported across all package managers, that won't be
the case for Yarn 2.x and above, or more concretely,
for the [Plug'n'Play](https://yarnpkg.com/features/pnp) feature.

> See [dont use bundled dependencies](https://yarnpkg.com/getting-started/migration#dont-use-bundledependencies)

### Static Binaries

Another option would have been to produce platform specific static binaries that embed both
dependencies as well as a node runtime.

This approach is valid, but really depends on the use case. For example if you need your package
to still be installable by npm, it doesn't really fit. Also, it's not relevant for libraries,
only CLI applications.

## How

Run the tool from the root directory of your package.

```console
Usage: node-bundle COMMAND

Commands:
  node-bundle validate  Validate the package is ready for bundling
  node-bundle write     Write the bundled version of the project to a temp directory
  node-bundle pack      Create the tarball
  node-bundle fix       Fix whatever we can for bundling

Options:
  --entrypoint      List of entrypoints to bundle             [array] [required]
  --copyright       Copyright statement to be added to the notice file
                                                             [string] [required]
  --external        Packages in this list will be excluded from the bundle and
                    added as dependencies (example: fsevents:optional)
                                                           [array] [default: []]
  --license         List of valid licenses                 [array] [default: []]
  --resource        List of resources that need to be explicitly copied to the
                    bundle (example:
                    node_modules/proxy-agent/contextify.js:bin/contextify.js)
                                                           [array] [default: []]
  --dont-attribute  Dependencies matching this regular expressions wont be added
                    to the notice file                                  [string]
  --test            Validation command to sanity test the bundle after its
                    created                                             [string]
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]

```

You can also use the programmatic access:

```ts
import { Bundle } from '@aws-cdk/node-bundle';

const bundle = new Bundle({
  packageDir: process.cwd(),
  copyright: 'Copyright 2018-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  entrypoints: ['lib/cli.js'],
  licenses: ['Apache-2.0', 'MIT'],
});

bundle.pack();
```

## Caveats

Bundling a package has implications on the API exposed from the package.
For pure CLI applications that don't export anything, this shouldn't be a problem.

However, if you are bundling either a library, or a CLI that is being consumed
as library as well, things can start to break.

This tool does preserve all original code and structure, so all your imports
will still be available for consumers, but:

1. The dependencies of those imports won't be available anymore. This means your
consumers are now responsible for installing those on their own. To mitigate this,
you can bundle up the files being imported as well (using additional entrypoints),
but bear in mind this will significantly ballon the package size.
2. If your bundled entrypoint can accept external types, and you perform type checks
on them using things like `instanceof`, these will fail because these
types are now completely foreign to your bundle.

In general, this tool was designed for command line applications, if your CLI is also
used as library, strongly consider extracting the library parts to a separate package.