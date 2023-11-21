# AWS CDK Vended Handler Framework

This module is an internal framework used to establish best practices for vending Lambda handlers that are deployed to user accounts. Primarily, this framework includes a centralized definition of the default runtime version which is the latest version of NodeJs available across all AWS Regions.

In addition to including a default runtime version, this framework forces the user to specify `compatibleRuntimes` for each Lambda handler being used. The framework first checks for the default runtime in the list of `compatibleRuntimes`. If found, the default runtime is used. If not found, the framework will look for the latest defined runtime in the list of `compatibleRuntimes`. If the latest runtime found is marked as deprecated, then the framework will force the build to fail. To continue, the user must specify a non-deprecated runtime version that the handler code is compatible with.

## CDK Handler

`CdkHandler` is a class that represents the source code that will be executed within a Lambda `Function` acting as a custom resource provider. Once constructed, this class contains three attributes:
1. `code` - the source code that is loaded from a local disk path
2. `entrypoint` - the name of the method within your `code` that Lambda calls to execute your `Function`
3. `compatibleRuntimes` - the runtimes that your `code` is compatible with

Note that `compatibleRuntimes` can be any python or nodejs runtimes, but the nodejs runtime family are preferred. Python runtimes are supported to provide support for legacy handler code that was written using python.

The following is an example of how to use `CdkHandler`:

```ts
const handler = CdkHandler.fromAsset(path.join(__dirname, 'my-handler'), {
  entrypoint: 'index.handler',
  compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
});
```

## CDK Function

The `CdkFunction` construct represents a Lambda `Function` that will act as a custom resource provider. The key difference between `CdkFunction` and Lambda `Function` is that `runtime`, `handler`, and `code` are all determined for `CdkFunction` via `CdkHandler` which is a required property. Notably, the `runtime` is determined via the `compatibleRuntimes` property of `CdkHandler`.

Note that the build will fail if the latest `runtime` found is marked as deprecated. If this happens you must specify a latest `code` compatible `runtime` that is not deprecated. Additionally, the build will fail if none of the `compatibleRuntimes` are in the python or nodejs family.

The following is an example of how to use `CdkFunction`:

```ts
const stack = new Stack();

const handler = CdkHandler.fromAsset(path.join(__dirname, 'my-handler'), {
  entrypoint: 'index.handler',
  compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
});

const fn = new CdkFunction(stack, 'CdkFunction', { handler });
```

## CDK Singleton Function

The following is an example of how to use `CdkSingletonFunction`:

```ts
const stack = new Stack();

const handler = CdkHandler.fromAsset(path.join(__dirname, 'my-handler'), {
  entrypoint: 'index.handler',
  compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
});

const fn = new CdkSingletonFunction(stack, 'CdkSingletonFunction', { handler });
```
