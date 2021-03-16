# An example Construct Library module

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This package contains an example CDK construct library
for an imaginary resource called ExampleResource.
Its target audience are construct library authors -
both when contributing to the core CDK codebase,
or when writing your own construct library.

Even though different construct libraries model vastly different services,
a large percentage of the structure of the construct libraries
(what we often call Layer 2 constructs, or L2s for short)
is actually strikingly similar between all of them.
This module hopes to present a skeleton of that structure,
that you can literally copy&paste to your own construct library,
and then edit to suit your needs.
It also attempts to explain the elements of that skeleton as best as it can,
through inline comments on the code itself.

## Using when contributing to the CDK codebase

If you're creating a completely new module,
feel free to copy&paste this entire directory,
and then edit the `package.json` and `README.md`
files as necessary (see the "Package structure" section below).
Make sure to remove the `"private": true` line from `package.json`
after copying, as otherwise your package will not be published!

If you're contributing a new resource to an existing package,
feel free to copy&paste the following files,
instead of the entire package:

* [`lib/example-resource.ts`](lib/example-resource.ts)
* [`lib/private/example-resource-common.ts`](lib/private/example-resource-common.ts)
* [`test/example-resource.test.ts`](test/example-resource.test.ts)
* [`test/integ.example-resource.ts`](test/integ.example-resource.ts)
* [`test/integ.example-resource.expected.json`](test/integ.example-resource.expected.json)

And proceed to edit and rename them from there.

## Using for your own construct libraries

Feel free to use this package as the basis of your own construct library;
note, however, that you will have to change a few things in `package.json` to get it to build:

* Remove the `"private": true` flag if you intend to publish your package to npmjs.org
  (see https://docs.npmjs.com/files/package.json#private for details).
* Remove the `devDependencies` on `cdk-build-tools`, `cdk-integ-tools` and `pkglint`.
* Remove the `lint`, `integ`, `pkglint`, `package`, `build+test+package`, `awslint`, and `compat` entries in the `scripts` section.
* The `build` script should be just `tsc`, `watch` just `tsc -w`, and `test` just `jest`.
* Finally, the `awscdkio` key should be completely removed.

You will also have to get rid of the integration test files,
[`test/integ.example-resource.ts`](test/integ.example-resource.ts) and
[`test/integ.example-resource.expected.json`](test/integ.example-resource.expected.json),
as those styles of integration tests are not available outside the CDK main repo.

## Code structure

The code structure is explained through inline comments in the files themselves.
Probably [`lib/example-resource.ts`](lib/example-resource.ts) is a good place to start reading.

### Tests

The package contains examples of unit tests in the [`test/example-resource.test.ts`](test/example-resource.test.ts)
file.

It also contains an example integration test in [`test/integ.example-resource.ts`](test/integ.example-resource.ts).
For more information on CDK integ tests, see the
[main `Contributing.md` file](../../../CONTRIBUTING.md#integration-tests).

## Package structure

The package uses the standard build and test tools available in the CDK repo.
Even though it's not published,
it also uses [JSII](https://github.com/aws/jsii),
the technology that allows CDK logic to be written once,
but used from multiple programming languages.
Its configuration lives the `jsii` key in `package.json`.
It's mainly used as a validation tool in this package,
as JSII places some constraints on the TypeScript code that you can write.
