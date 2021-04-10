# @monocdk-experiment/rewrite-imports
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they
> become stable. We will only make breaking changes to address unforeseen API issues. Therefore,
> these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes
> will be announced in release notes. This means that while you may use them, you may need to
> update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Migrate TypeScript `import` statements from modular CDK (i.e. `@aws-cdk/aws-s3`) to mono-cdk (i.e. `monocdk/aws-s3`);

Usage:

```shell
$ rewrite-imports lib/**/*.ts
```

NOTE: `node_modules` and `*.d.ts` files are ignored.
