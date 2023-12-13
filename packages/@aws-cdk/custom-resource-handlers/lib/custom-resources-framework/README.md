# AWS CDK Custom Resource Framework

The CDK custom resource framework is an internal framework developed to establish best practices, runtime enforcement, and consistency for custom resource providers and their associated source code. 

# Creating a Custom Resource Provider

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

The [config](./config.ts) file is structured with the top most level mapping to a specific service, i.e., `aws-s3`, `aws-dynamodb`, etc. Each service can contain one or more provider modules. Provider modules are containers for custom resource providers and will be rendered as a code generated file. Each provider module can contain one or more `ProviderProps` objects. Each `ProviderProps` object contains all the necessary information required to generate a single custom resource provider. For more clarity, consider the following example of the [config](./config.ts) file:

```ts
const config = {
  'aws-certificatemanager': {
    'certificate-request-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-certificatemanager' 'dns-validated-certificate-handler', 'index.js'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        handler: 'index.certificateRequestHandler',
      },
    ],
  },
  'aws-s3': {
    'replica-provider': [
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        handler: 'index.onEventHandler',
      },
      {
        type: ComponentType.CDK_FUNCTION,
        sourceCode: path.resolve(__dirname, '..', 'aws-dynamodb', 'replica-handler', 'index.ts'),
        compatibleRuntimes: [Runtime.NODEJS_18_X],
        handler: 'index.isCompleteHandler',
      },
    ],
  },
};
```

Inspecting the above example gives us the following information:
- There are two services present: `aws-certificatemanager` and `aws-s3`
- Both the `aws-certificatemanager` and `aws-dynamodb` services contain a single provider module - `certificate-request-provider` and `replica-provider`, respectively
- The `certificate-request-provider` contains a single custom resource provider which is a `CdkFunction`
- The `replica-provider` provider module contains two custom resource providers both of which are `CdkFunction`


