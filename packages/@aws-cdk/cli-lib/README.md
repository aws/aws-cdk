# AWS CDK CLI Library
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

## ⚠️ Experimental module

This package is highly experimental. Expect frequent API changes and incomplete features.
Known issues include:

- **JavaScript/TypeScript only**\
  The jsii packages are currently not in a working state.
- **No useful return values**\
  All output is currently printed to stdout/stderr
- **Missing or Broken options**\
  Some CLI options might not be available in this package or broken

## Overview

Provides a library to interact with the AWS CDK CLI programmatically from jsii supported languages.
Currently the package includes implementations for:

- `cdk deploy`
- `cdk synth`
- `cdk destroy`
- `cdk list`

## Setup

### AWS CDK app directory

Obtain an `AwsCdkCli` class from an AWS CDK app directory (containing a `cdk.json` file):

```ts fixture=imports
const cli = AwsCdkCli.fromCdkAppDirectory("/path/to/cdk/app");
```

### Cloud Assembly Directory Producer

You can also create `AwsCdkCli` from a class implementing `ICloudAssemblyDirectoryProducer`.
AWS CDK apps might need to be synthesized multiple times with additional context values before they are ready.

The `produce()` method of the `ICloudAssemblyDirectoryProducer` interface provides this multi-pass ability.
It is invoked with the context values of the current iteration and should use these values to synthesize a Cloud Assembly.
The return value is the path to the assembly directory.

A basic implementation would look like this:

```ts fixture=imports
class MyProducer implements ICloudAssemblyDirectoryProducer {
  async produce(context: Record<string, any>) {
    const app = new cdk.App({ context });
    const stack = new cdk.Stack(app);
    return app.synth().directory;
  }
}
```

For all features (e.g. lookups) to work correctly, `cdk.App()` must be instantiated with the received `context` values.
Since it is not possible to update the context of an app, it must be created as part of the `produce()` method.

The producer can than be used like this:

```ts fixture=producer
const cli = AwsCdkCli.fromCloudAssemblyDirectoryProducer(new MyProducer());
```

## Commands

### list

```ts
// await this asynchronous method call using a language feature
cli.list();
```

### synth

```ts
// await this asynchronous method call using a language feature
cli.synth({
  stacks: ['MyTestStack'],
});
```

### deploy

```ts
// await this asynchronous method call using a language feature
cli.deploy({
  stacks: ['MyTestStack'],
});
```

### destroy

```ts
// await this asynchronous method call using a language feature
cli.destroy({
  stacks: ['MyTestStack'],
});
```
