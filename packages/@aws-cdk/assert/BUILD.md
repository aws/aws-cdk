# How this package is built

This package is built by copying the sources from `assert-internal`,
and if on the v2 branch transforming the imports to depend on the v2 library,
`aws-cdk-lib`.

We don't use this package for the CDK build itself. Instead, for the
individual packages that make up the monopackage, we build and test against
the `assert-internal` package and its dependency on `@aws-cdk/core`.

We then build and publish this package for our users to consume.

* For v1, this is just a straight-up copy of `assert-internal` with its
  dependency on `@aws-cdk/core`.
* For v2, we rewrite to depend on `aws-cdk-lib` instead.