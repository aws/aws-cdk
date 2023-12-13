# AWS CDK Custom Resource Framework

The CDK custom resource framework is an internal framework developed to establish best practices, runtime enforcement, and consistency for custom resource providers and their associated source code. 

## Custom Resource Framework Concepts

Custom resource providers can be created in one of three forms - `CdkFunction`, `CdkSingletonFunction`, or `CdkCustomResourceProvider`. These three custom resource provider formats are a code generated wrapper around the lambda `Function`, lambda `SingletonFunction`, and `CustomResourceProvider` constructs, respectively. These new CDK prefixed constructs will offer the same behavior and initialization options as their parent minus the ability to configure the following properties during construction:
- `handler` - the name of the method within your code that the provider calls to execute your function
- `code` - the source code of your provider
- `codeDirectory` - a local file system directory with the provider's code
- `runtime` - the runtime environment for the provider that you are uploading

Instead, these properties will be automatically generated using the `ProviderProps` configured in the [config](./config.ts) file:
- `type`: the custom resource provider type to generate
- `sourceCode`: the source code that will be executed by the provider
- `compatibleRuntimes`: runtimes that are compatible with the provider's source code
- `handler`: the name of the method within your code that the provider calls to execute your function

The [config](./config.ts) file is structured with the top most level mapping to a `aws-cdk-lib` module, i.e., `aws-s3`, `aws-dynamodb`, etc. Each service can contain one or more provider modules. Provider modules are containers for custom resource providers and will be rendered as a code generated file. Each provider module can contain one or more `ProviderProps` objects. Each `ProviderProps` object contains all the necessary information required to generate a single custom resource provider. The following example shows a more structural breakdown of how the [config](./config.ts) file is configured:

```ts
const config = {
  'aws-s3': { // the aws-cdk-lib module
    'replica-provider': [ // the custom resource provider module
      // custom resource provider defined as ProviderProps object
      {
        // the custom resource provider type - `CdkFunction`
        type: ComponentType.CDK_FUNCTION,
        // the source code that the provider will execute
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        // runtimes that are compatible with the source code
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        // the handler in the source code that the provider will execute
        handler: 'index.onEventHandler',
      },
    ],
  },
  'aws-stepfunctions-tasks': {
    // contains multiple custom resource provider modules
    'eval-nodejs-provider': [
      {
        // the custom resource provider type - `CdkSingletonFunction`
        type: ProviderType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'eval-nodejs-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
      },
    ],
    'role-policy-provider': [
      {
        type: ProviderType.CDK_SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'role-policy-handler', 'index.py'),
        compatibleRuntimes: [Runtime.PYTHON_3_9],
        // prevent minify and bundle flag is set since the source code is a python file
        preventMinifyAndBundle: true,
      },
    ],
  },
};
```

Code generation for the provider modules is triggered when this package - `@aws-cdk/custom-resource-handlers` - is built. Importantly, this framework is also responsible for minifying and bundling the custom resource providers' source code and dependencies. A flag named `preventMinifyAndBundle` can be configured as part of the `ProviderProps` to prevent minifying and bundling the source code for a specific provider. This flag is `false` by default and is only needed for Python files or for JavaScript/TypeScript files containing require imports.

Once built, all generated code and bundled source code will be written to `@aws-cdk/custom-resource-handlers/dist`. The top level field in the [config](./config.ts) file defining individual `aws-cdk-lib` modules will be used to create specific directories within `@aws-cdk/custom-resource-handlers/dist` and each provider module will be a separate code generated file within these directories named as `<provider-module>.generated.ts`. As an example, the sample [config](./config.ts) file above would create the following file structure:

|--- @aws-cdk
|   |--- custom-resource-handlers
|   |   |--- dist
|   |   |   |--- aws-s3
|   |   |   |   |--- replica-handler
|   |   |   |   |   |--- index.js
|   |   |   |   |--- replica-provider.generated.ts
|   |   |   |--- aws-stepfunctions-tasks
|   |   |   |   |--- eval-nodejs-handler
|   |   |   |   |   |--- index.js
|   |   |   |   |--- role-policy-handler
|   |   |   |   |   |--- index.py
|   |   |   |   |--- eval-nodejs-provider.generated.ts
|   |   |   |   |--- role-policy-provider.generated.ts

The code generated custom resource providers are usable in `aws-cdk-lib` once `aws-cdk-lib` is built. The custom resource providers will be consumable from `aws-cdk-lib/custom-resource-handlers/dist` and the file structure therein will match what was generated in `@aws-cdk/custom-resource-handlers/dist` except for providers defined in `core`. To prevent circular dependencies, all custom resource providers defined in `core`and any associated source code will be consumable from `aws-cdk-lib/core/dist/core`.

## Creating a Custom Resource Provider

Creating a new custom resource provider involves three steps:
1. Add the custom resource provider's source code to `@aws-cdk/custom-resource-handlers/lib/<aws-cdk-lib-module>`
2. Update the [config](./config.ts) file with the custom resource provider to generate by specifying all required `ProviderProps`.
3. At this point you can directly build `@aws-cdk/custom-resource-handlers` with `yarn build` to view the generated provider in `@aws-cdk/custom-resource-handlers/dist`. Alternatively, you can build `aws-cdk-lib` with `npx lerna run build --scope=aws-cdk-lib --skip-nx-cache` to make the generated provider available for use within `aws-cdk-lib`
