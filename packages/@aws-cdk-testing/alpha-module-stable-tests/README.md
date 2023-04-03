# CDK CLI integration test
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This package contains CDK unit tests for stable integration modules that integrate a stable module with one or more alpha modules.
For example, `aws-events-targets` is an integration module that depends on both `aws-cdk-lib/aws-events` and `@aws-cdk/aws-batch`.

## Tests

The tests themselves live in `test/`:

```text
test/
├── aws-events-targets
├── aws-stepfunctions-tasks
```

Each directory contains one directory per service that it integrates with; all the relevant unit tests go there.
