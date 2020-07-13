Regression Test Patches
========================

The regression test suite will use the test suite of an OLD version
of the CLI when testing a NEW version of the CLI, to make sure the
old tests still pass.

Sometimes though, the old tests won't pass. This can happen when we
introduce breaking changes to the framework or CLI (for something serious,
such as security reasons), or maybe because we had a bug in an old
version that happened to pass, but now the test needs to be updated
in order to pass a bugfix.

## Mechanism

The files in this directory will be copied over the test directory
so that you can exclude tests from running, or patch up test running
scripts.

Files will be copied like so:

```
aws-cdk/test/integ/cli-regression-patches/vX.Y.Z/*

# will be copied into

aws-cdk/test/integ/cli
```

For example, to skip a certain integration test during regression
testing, create the following file:

```
cli-regression-patches/vX.Y.Z/skip-tests.txt
```

If you need to replace source files, it's probably best to stick
compiled `.js` files in here. `.ts` source files wouldn't compile
because they'd be missing `imports`.

## Versioning

The patch sets are versioned, so that they will only be applied for
a certain version of the tests and will automatically age out when
we proceed past that release.

The version in the directory name needs to be named after the
version that contains the *tests* we're running, that need to be
patched.

So for example, if we are running regression tests for release
candidate `1.45.0`, we would use the tests from released version
`1.44.0`, and so you would call the patch directory `v1.44.0`.

