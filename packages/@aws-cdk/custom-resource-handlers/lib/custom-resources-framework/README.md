# CDK Handler Framework

The CDK handler framework is an internal framework used to code generate constructs that extend a lambda `Function`, lambda `SingletonFunction`, or core `CustomResourceProvider` construct and prohibit the user from directly configuring the `handler`, `runtime`, `code`, and `codeDirectory` properties.  In doing this, we are able to establish best practices, runtime enforcement, and consistency across all handlers we build and vend within the aws-cdk.

## CDK Handler Framework Concepts

This framework allows for the creation of three component types:
1. `ComponentType.FUNCTION` - This is a wrapper around the lambda `Function` construct. It offers the same behavior and performance as a lambda `Function`, but it restricts the consumer from configuring the `handler`, `runtime`, and `code` properties.
2. `ComponentType.SINGLETON_FUNCTION` - This is a wrapper around the lambda `SingletonFunction` construct. It offers the same behavior and performance as a lambda `SingletonFunction`, but it restricts the consumer from configuring the `handler`, `runtime`, and `code` properties.
3. `ComponentType.CUSTOM_RESOURCE_PROVIDER` - This is a wrapper around the core `CustomResourceProvider` construct. It offers the same behavior and performance as a `CustomResourceProvider` and can be instantiated via the `getOrCreate` or `getOrCreateProvider` methods. This component restricts the consumer from configuring the `runtime` and `codeDirectory` properties.

Code generating one of these three component types requires adding the component properties to the [config](./config.ts) file by providing `ComponentProps`. The `ComponentProps` are responsible for code generating the specified `ComponentType` with the `handler`, `runtime`, `code`, and `codeDirectory` properties set internally. `ComponentProps` includes the following properties:
- `type` - the framework component type to generate.
- `sourceCode` - the source code that will be excuted by the framework component.
- `runtime` - the runtime that is compatible with the framework component's source code. This is an optional property with a default node runtime that will be the latest available node runtime in the `Stack` deployment region. In general, you should not configure this property unless a `runtime` override is absolutely necessary.
- `handler` - the name of the method with the source code that the framework component will call. This is an optional property and the default is `index.handler`.
- `minifyAndBundle` - whether the source code should be minified and bundled. This an optional property and the default is `true`. This should only be set to `false` for python files or for typescript/javascript files with a require import.

The [config](./config.ts) file is structured with the top level mapping to an aws-cdk module, i.e., aws-s3, aws-dynamodb, etc. Each service can contain one or more component modules. Component modules are containers for handler framework components and will be rendered as a code generated file. Each component module can contain one or more `ComponentProps` objects. The following example shows a more structural breakdown of how the [config](./config.ts) file is configured:

```ts
const config = {
  'aws-s3': { // the aws-cdk-lib module
    'replica-provider': [ // the component module
      // handler framework component defined as a `ComponentProps` object
      {
        // the handler framework component type
        type: ComponentType.FUNCTION,
        // the source code that the component will use
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        // the handler in the source code that the component will execute
        handler: 'index.onEventHandler',
      },
    ],
  },
  'aws-stepfunctions-tasks': {
    // contains multiple component modules
    'eval-nodejs-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'eval-nodejs-handler', 'index.ts'),
      },
    ],
    'role-policy-provider': [
      {
        type: ComponentType.SINGLETON_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-stepfunctions-tasks', 'role-policy-handler', 'index.py'),
        runtime: Runtime.PYTHON_3_9,
        // prevent minify and bundle since the source code is a python file
        minifyAndBundle: false,
      },
    ],
  },
};
```

Code generation for the component modules is triggered when this package - `@aws-cdk/custom-resource-handlers` - is built. Importantly, this framework is also responsible for minifying and bundling the custom resource providers' source code and dependencies. A flag named `minifyAndBundle` can be configured as part of the `ComponentProps` to prevent minifying and bundling the source code for a specific provider. This flag is only needed for python files or for typescript/javascript files containing require imports.

Once built, all generated code and bundled source code will be written to `@aws-cdk/custom-resource-handlers/dist`. The top level field in the [config](./config.ts) file defining individual aws-cdk modules will be used to create specific directories within `@aws-cdk/custom-resource-handlers/dist` and each component module will be a separate code generated file within these directories named `<component-module>.generated.ts`. As an example, the sample [config](./config.ts) file above would create the following file structure:

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

The code generated handler framework components are consumable from `aws-cdk-lib/custom-resource-handlers/dist` once `aws-cdk-lib` is built. The file structure of `aws-cdk-lib/custom-resource-handlers/dist` will have the same structure as `@aws-cdk/custom-resource-handlers/dist` with the exception of `core`. To prevent circular dependencies, all handler framework components defined in `core`and any associated source code will be consumable from `aws-cdk-lib/core/dist/core`.

## Creating a Handler Framework Component

Creating a new handler framework component involves three steps:
1. Add the source code to `@aws-cdk/custom-resource-handlers/lib/<aws-cdk-lib-module>`
2. Update the [config](./config.ts) file by specifying all required `ComponentProps`.
3. At this point you can directly build `@aws-cdk/custom-resource-handlers` with `yarn build` to view the generated component in `@aws-cdk/custom-resource-handlers/dist`. Alternatively, you can build `aws-cdk-lib` with `npx lerna run build --scope=aws-cdk-lib --skip-nx-cache` to make the generated component available for use within `aws-cdk-lib`
