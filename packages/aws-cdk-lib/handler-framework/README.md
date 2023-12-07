# AWS CDK Vended Handler Framework

Note: This is framework intended for internal use only.

The handler framework module is an internal framework used to establish best practices for vending Lambda handlers that are deployed to user accounts. Primarily, this framework includes a centralized definition of the default runtime version which is the latest version of NodeJs available across all AWS Regions.

In addition to including a default runtime version, this framework forces the user to specify `compatibleRuntimes` for each Lambda handler being used. The framework first checks for the default runtime in the list of `compatibleRuntimes`. If found, the default runtime is used. If not found, the framework will look for the latest defined runtime in the list of `compatibleRuntimes`. If the latest runtime found is marked as deprecated, then the framework will force the build to fail. To continue, the user must specify a non-deprecated runtime version that the handler code is compatible with.

## CDK Handler

`CdkHandler` is a class that represents the source code that will be executed within a Lambda `Function` acting as a custom resource provider. Once constructed, this class contains four attributes:
1. `codeDirectory` - the local file system directory with the provider's code. This the code that will be bundled into a zip asset and wired to the provider's AWS Lambda function.
2. `code` - the source code that is loaded from a local disk path
3. `entrypoint` - the name of the method within your `code` that Lambda calls to execute your `Function`. Note that the default entrypoint is 'index.handler'
4. `compatibleRuntimes` - the runtimes that your `code` is compatible with

Note that `compatibleRuntimes` can be any python or nodejs runtimes, but the nodejs runtime family is preferred. Python runtimes are supported to provide support for legacy handler code that was written using python.

The following is an example of how to use `CdkHandler`:

```ts
const stack = new Stack();

const handler = new CdkHandler(stack, 'Handler', {
  codeDirectory: path.join(__dirname, 'my-handler'),
  entrypoint: 'index.onEventHandler',
  compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
});
```
