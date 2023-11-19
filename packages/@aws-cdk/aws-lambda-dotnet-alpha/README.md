# Amazon Lambda .NET Library
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

This library provides constructs for Golang Lambda functions.

To use this module you will either need to have `.NET SDK` installed (`.NET 6.0` or later) or `Docker` installed.

## .NET Function

Define a `DotNetFunction`:

```ts
new dotnet.DotNetFunction(this, 'MyFunction', {
  projectDir: 'src/MyFunction'
});
```

TODO
