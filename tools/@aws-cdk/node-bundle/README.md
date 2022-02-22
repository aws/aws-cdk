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

- Enforce no circular imports are exhibited in your package, nor in your dependency closure.

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
  node-bundle write     Write the bundled version of the project to a temp
                        directory
  node-bundle pack      Write the bundle and create the tarball

Options:
  --entrypoint      List of entrypoints to bundle                        [array]
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
  licenses: ['Apache-2.0', 'MIT'],
});

bundle.pack();
```

### Integrate with your build process

We recommend to integrate this tool in the following way:

1. Add a `node-bundle validate` command as a post compile step.
2. Set your packaging command to `node-bundle pack`.

This way, local dev builds will be validated not to break any functionality needed for bundling.
In addition, developers can run `node-bundle validate --fix` to automatically fix any (fixable) violations
and commit that to source code.

For example, if a dependency is added but the attribution file has not been re-generated,
`validate` will catch this, and `validate --fix` will regenerate it.

## Take into account

By default, the tool will use the `main` directive of the `package.json` as
the entrypoint. This will ensure that all top level exports of the
package are preserved.

Deep imports such as `const plugins = require('your-package/lib/plugins')` are considered
private and should not be used by your consumers. However, if you absolutely have to
preserve those as well, you should pass custom multiple entry-points for each deep import.
Note that this will balloon up the package size significantly.

If you are bundling a CLI application that also has top level exports, we suggest to extract
the CLI functionality into a function, and add this function as an export to `index.js`.

> See [aws-cdk](https://github.com/aws/aws-cdk/blob/master/packages/aws-cdk/bin/cdk.ts) as an example.