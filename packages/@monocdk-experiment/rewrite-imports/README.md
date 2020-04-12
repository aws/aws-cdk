# @monocdk-experiment/rewrite-imports
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Migrate TypeScript `import` statements from modular CDK (i.e. `@aws-cdk/aws-s3`) to mono-cdk (i.e. `monocdk-experiment/aws-s3`);

Usage:

```shell
$ rewrite-imports lib/**/*.ts
```

NOTE: `node_modules` and `*.d.ts` files are ignored.