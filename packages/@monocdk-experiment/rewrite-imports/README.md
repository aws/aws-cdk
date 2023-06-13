# @monocdk-experiment/rewrite-imports
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

Migrate TypeScript `import` statements from modular CDK (i.e. `@aws-cdk/aws-s3`) to mono-cdk (i.e. `monocdk/aws-s3`);

Usage:

```shell
$ rewrite-imports lib/**/*.ts
```

NOTE: `node_modules` and `*.d.ts` files are ignored.
