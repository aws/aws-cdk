# aws-cdk-migration

Migrate TypeScript `import` statements from modular CDK (i.e. `@aws-cdk/aws-s3`) to aws-cdk-lib (i.e. `aws-cdk-lib`), as well as imports of `Construct` from `@aws-cdk/core` to `constructs`.

Usage:

```shell
$ npx -p aws-cdk-migration rewrite-imports-v2 lib/**/*.ts
```

NOTE: `node_modules` and `*.d.ts` files are ignored.
