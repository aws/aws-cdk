# AWS CDK Custom Resources

<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->
- [Provider Framework](#provider-framework)
  - [User-defined Handlers](#user-defined-handlers)
    - [onEvent](#onevent)
    - [isComplete](#iscomplete)
  - [Provider API](#provider-api)
  - [Execution Policy](#execution-policy)
  - [Resources Instances](#resources-instances)
  - [Patterns and Practices](#patterns-and-practices)
    - [Wrapper constructs](#wrapper-constructs)
    - [Packaging providers in nested stacks](#packaging-providers-in-nested-stacks)
    - [Sharing providers across apps](#sharing-providers-across-apps)
  - [Complete Example](#complete-example)
- [Custom Resources for AWS APIs](#custom-resources-for-aws-apis)
  - [Examples](#examples)


## Provider Framework

The `@aws-cdk/custom-resources.Provider` is a "mini-framework" for
implementing providers for AWS CloudFormation [custom
resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html).
It offers a high-level API which makes it easier to implement robust and
powerful custom resources and includes the folowing capabilities:

* Handles responses to AWS CloudFormation and protects against blocked
  deployments
* Validates values returned by the user handler to help with correct handler implementation
* Supports asynchronous handlers to allow long operations which can exceed the AWS Lambda timeout
* Supports all AWS Lambda language runtimes

This guide provides an reference for authoring custom resources using the
provider framework.

### User-defined Handlers

The provider framework is triggered by AWS CloudFormation for all custom
resource lifecycle events (create, update, delete) and, in turn, invokes a set
of user-defined AWS Lambda handlers.

At the minimum, users must define the `onEvent` handler, which is invoked by the
framework for all resource lifecycle events (`Create`, `Update` and `Delete`)
and returns a result which is then submitted to CloudFormation.

Users may also provide an additional handler called `isComplete`, for cases
where the lifecycle operation cannot be completed immediately. The `isComplete`
handler will be invoked immediately and synchronously after `onEvent` and then
retried asynchronously until it returns `IsComplete: true` (or until the total
timeout expired).

This section describes the inputs and outputs of the AWS Lambda handlers defined
by the user. Handlers are defined as normal AWS Lambda functions. Inputs are
passed in through the AWS Lambda event and outputs are returned through return
values. If an error occur, the handler should throw an exception, which will be
caught by the framework and replied back to AWS CloudFormation.

#### onEvent

The `onEventHandler` handler is invoked by the framework as a result of any
lifecycle event.

The input event includes the following fields derived from the [Custom
Resource Provider
Request](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html#crpg-ref-request-fields):

|Field|Type|Required|Description
|-----|----|--------|-----------
|`RequestType`|String|Yes|The request type is set by the AWS CloudFormation stack operation (create-stack, update-stack, or delete-stack) that was initiated by the template developer for the stack that contains the custom resource. Must be one of: `Create`, `Update`, or `Delete`. For more information, see [Custom Resource Request Types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requesttypes.html).
|`StackId`|String|Yes|The Amazon Resource Name (ARN) that identifies the stack that contains the custom resource.
|`RequestId`|String|Yes|A unique ID for the request.
|`ResourceType`|String|Yes|The template developer-chosen resource type of the custom resource in the AWS CloudFormation template. Custom resource type names can be up to 60 characters long and can include alphanumeric and the following characters: _@-.
|`LogicalResourceId`|String|Yes|The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template. This is provided to facilitate communication between the custom resource provider and the template developer.
|`PhysicalResourceId`|String|Only for Update and Delete|A required custom resource provider-defined physical ID that is unique for that provider.
|`ResourceProperties`|JSON|No|This field contains the contents of the Properties object sent by the template developer. Its contents are defined by the custom resource provider.
|`OldResourceProperties`|JSON|Only for Update|Contains the resource properties that were declared previous to the update request.

Return value must be a JSON object with the following fields:

|Field|Type|Required|Description
|-----|----|--------|-----------
|`PhysicalResourceId`|String|Yes|The allocated/assigned physical ID of the resource. Must be returned for all request types, including `Update` and `Delete`, even if the physical ID hasn't changed.
|`Data`|JSON|No|Resource attributes, which can later be retrieved through `Fn::GetAtt` on the custom resource object.

If an error is thrown during `onEvent`, it will be caught by the framework and a
"FAILED" response will be submitted to AWS CloudFormation.

#### isComplete

If defined, the `isCompleteHandler` handler is invoked by the framework
**immediately and synchronously** after `onEvent` returns and then, as long as
it returns `IsComplete: false`, this handler will be retried periodically based
on the `queryInterval` option until it either returns `IsComplete: true` or the
`totalTimeout` expires. If the timeout expires, the framework will fail the
resource operation with an **"Operation timed out"** error.

Input event is similar to `onEvent`, and there is a guarantee that
`PhysicalResourceId` is defined (since it must be returned by `onEvent`).

Return value must be a JSON object with the following fields:

|Field|Type|Required|Description
|-----|----|--------|-----------
|`IsComplete`|Boolean|Yes|Indicates if the operation has finished or not.
|`Data`|JSON|No|Additional resource attributes. These attributes will be **merged** with the ones returned from `onEvent`

If an error is thrown during `onEvent`, it will be caught by the framework and a
"FAILED" response will be submitted to AWS CloudFormation.

### Provider API

Once user-defined handlers are defined, you will need to define a `Provider`
which will configure the framework:

```ts
import cr = require('@aws-cdk/custom-resources');

const myProvider = new cr.Provider(this, 'MyProvider', {
  // lambda options
  code: lambda.Code.fromAsset(path.join(__dirname, 'location/of/handler/directory')),
  runtime: lambda.Runtime.PYTHON_3_7, // all runtimes are supported

  // main handler name (syntax is runtime-specific, same as AWS Lambda)
  onEventHandler: 'index.on_event',

  // policy statements for execution role (optional)
  policy: [ /* ... */  ]

  // options for async retry (optional)
  isCompleteHandler: 'index.is_complete',
  queryInterval: Duration.seconds(5),
  totalTimeout: Duration.hours(1),
});
```

Normally, we would only want a single instance of the provider for multiple
resources. The following pattern can be used to define a singleton `cr.Provider` instance
at the stack level:

```ts
const stack = Stack.of(this);
const uid = 'com.acme.myresource.provider';
const myProvider = stack.node.tryFindChild(uid) as cr.Provider || new cr.Provider(stack, uid, {
  /*...*/
});
```

### Execution Policy

The `policy` option can be used to define a set of IAM policy statements that
will be included in the policy document of the roles that execute the user
handler(s). 

The `Provider` construct implements `iam.IGrantable`, which means that you
can use it as a target of any `grant` method:

```ts
myBucket.grantRead(myProvider);
```

Bear in mind that in most cases, a single provider will be used for multiple
resource instances. This means that if multiple resources in the same app share
an instance of `myProvider`, then multiple calls to `grantRead` will add
additional statements to the same policy. This might be the desired
least-privilege effect, but bear in mind that it will likely create a dependency
from the provider to the resources, which will not allow you to separate the
provider to a separate stack or app.

If the provider is defined in a separate app, you will need to grant it wider
permissions in order to be able to accommodate to multiple resources. It is not uncommon for resource provisioning logic to have extensive permissions on the account.

The
following example grants the provider `s3:GetObject` permissions to all buckets:

```ts
new cr.Provider(this, 'MyProvider', {
  // ...
  policy: [
    new iam.PolicyStatement({ actions: [ 's3:GetObject' ], resources: [ '*' ] })
  ],
});
```

### Resources Instances

Then, you can define any number of resources that use this provider:

```ts
import cfn = require('@aws-cdk/aws-cloudformation');

new cfn.CustomResource(this, 'Resource1', {
  resourceType: 'Custom::MyResource',
  provider: cfn.CustomResourceProvider.lambda(myProvider.entrypoint),
  properties: {
    Foo: 123,
    Bar: [ 'hello', 'world' ]
  }
});

new cfn.CustomResource(this, 'Resource2', {
  resourceType: 'Custom::MyResource',
  provider: cfn.CustomResourceProvider.lambda(myProvider.entrypoint),
  properties: {
    Foo: 999
  }
});
```

### Patterns and Practices

#### Wrapper constructs

It is recommended to wrap the singleton provider and the custom resource
definition within a strongly-typed construct that encapsulates the fact that the
construct is implemented using a custom resource:

```ts
export interface MyResourceProps {
  readonly foo: number;
  readonly bar?: string[];
}

export class MyResource extends Construct {
  constructor(scope: Construct, id: string, props: MyResourceProps) {
    super(scope, id);

    // stack-singleton provider
    const stack = Stack.of(this);
    const uid = 'com.acme.myresource.provider';
    const myProvider = stack.node.tryFindChild(uid) as cr.Provider || new cr.Provider(stack, uid, {
      /*...*/
    });

    // a child named "Resource" will automatically be assigned to `node.defaultChild`.
    new cfn.CustomResource(this, 'Resource', {
      resourceType: 'Custom::MyResource',
      provider: cfn.CustomResourceProvider.lambda(myProvider.entrypoint),
      properties: {
        Foo: props.foo,
        Bar: props.bar
      }
    });
  }
}
```

Then, the usage is more idiomatic:

```ts
new MyResource(this, 'Resource1', {
  foo: 123,
  bar: [ 'hello', 'world' ]
});

new MyResource(this, 'Resource2', {
  foo: 999
});
```

#### Packaging providers in nested stacks

If you wish to minimize the number of resources custom resource providers
consume in user templates, you can use an
`@aws-cdk/aws-cloudformation.NestedStack` to package a provider (or providers)
as an AWS CloudFormation nested stack. Nested stacks will always be deployed
together with their parent and are represented as a single resource within the
parent template.

The following function uses the singleton pattern to define a nested stack that
contains the provider. This means that all resources related to the provider
will be managed within the nested stack, and only the resource provider's
service token (function ARN) will be outputted from it to the parent.

```ts
function getCreateProvider(scope: Construct) {
  const stack = Stack.of(scope);
  const uid = 'com.acme.myprovider';
  let nested = stack.node.tryFindChild(uid) as cfn.NestedStack;
  if (!nested) {
    nested = new cfn.NestedStack(stack, uid);
    new cr.Provider(nested, 'Default', { /* ... */ });
  }
  return nested.node.defaultChild as cr.Provider;
}
```

#### Sharing providers across apps

If a team manages multiple CDK apps within the same AWS environment
(account/region), they might want to deploy their custom resource provider/s once
into this environment and consume them from multiple apps.

This can be achieved by deploying providers through a separate CDK app and
publishing the provider ARN through AWS CloudFormation exports and importing it
in the consuming stack.

The following code defines a CDK stack for the provider and exports it's ARN under the `my-provider-entrypoint` export:

```ts
class MyProviderStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const provider = new cr.Provider(this, 'MyProvider', { /* ... */ });

    new CfnOutput(this, 'PublishMyProvider', {
      value: provider.entrypoint.functionArn,
      exportName: `my-provider-entrypoint`
    });
  }
}
```

Now, when we define our custom resource wrapper, we will import this value and use it
as the function:

```ts
import { Fn } from '@aws-cdk/core';

export class MyResource extends Construct {
  constructor(scope: Construct, id: string, props: MyResourceProps) {
    super(scope, id);

    // import the shared provider's entrypoint from the export "my-provider-entrypoint".
    const entrypointArn = Fn.importValue('my-provider-entrypoint');
    const entrypoint = lambda.Function.fromFunctionArn(this, 'ProviderEntrypoint', entrypointArn);

    new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(entrypoint),
      // ...
    });
  }
}
```





### Complete Example

A complete sample which demonstrates the use of the provider framework is
available [here](./test/provider-framework/integration).

It implements two resources: `S3File` and `S3Assert`. `S3File` creates a file
with specific content inside an S3 bucket, and `S3Assert` ascertains that an S3
file contains some expected content.

The `S3File` resource is implemented synchronously. It finishes it's operation
during `onEvent` and `isComplete` will always return `true`. `S3Assert`, on the
other hand, "waits" for the content to become available for a specified timeout.
It is implemented by reading the file from S3 during `isComplete` and returning
`false` as long as the file doesn't exist or it's contents are different than
expected. After the allotted timeout, the resource will fail with **"Operation
timed out"**.

Other aspects this sample demonstrates:

- Packaging of the providers as a singleton nested stack, while the actual
  resource instances are defined in the parent stack.
- Implement handlers in multiple languages: node.js (`S3File`) and Python (`S3Assert`).
- `S3File`: two instances of a single resource using the same provider.
- `S3File`: automatically generate physical names if `objectKey` is not defined.
- `S3File`: handle physical name change.
- `S3File`: return resource attributes
- `S3File`: handler deletions.

## Custom Resources for AWS APIs

Sometimes a single API call can fill the gap in the CloudFormation coverage. In
this case you can use the `AwsCustomResource` construct. This construct creates
a custom resource that can be customized to make specific API calls for the
`CREATE`, `UPDATE` and `DELETE` events. Additionally, data returned by the API
call can be extracted and used in other constructs/resources (creating a real
CloudFormation dependency using `Fn::GetAtt` under the hood).

The physical id of the custom resource can be specified or derived from the data
returned by the API call.

The `AwsCustomResource` uses the AWS SDK for JavaScript. Services, actions and
parameters can be found in the [API documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html).

Path to data must be specified using a dot notation, e.g. to get the string value
of the `Title` attribute for the first item returned by `dynamodb.query` it should
be `Items.0.Title.S`.

### Examples

Verify a domain with SES:

```ts
const verifyDomainIdentity = new AwsCustomResource(this, 'VerifyDomainIdentity', {
  onCreate: {
    service: 'SES',
    action: 'verifyDomainIdentity',
    parameters: {
      Domain: 'example.com'
    },
    physicalResourceIdPath: 'VerificationToken' // Use the token returned by the call as physical id
  }
});

new route53.TxtRecord(zone, 'SESVerificationRecord', {
  recordName: `_amazonses.example.com`,
  recordValue: verifyDomainIdentity.getData('VerificationToken')
});
```

Get the latest version of a secure SSM parameter:

```ts
const getParameter = new AwsCustomResource(this, 'GetParameter', {
  onUpdate: { // will also be called for a CREATE event
    service: 'SSM',
    action: 'getParameter',
    parameters: {
      Name: 'my-parameter',
      WithDecryption: true
    },
    physicalResourceId: Date.now().toString() // Update physical id to always fetch the latest version
  }
});

// Use the value in another construct with
getParameter.getData('Parameter.Value')
```

IAM policy statements required to make the API calls are derived from the calls
and allow by default the actions to be made on all resources (`*`). You can
restrict the permissions by specifying your own list of statements with the
`policyStatements` prop. The custom resource also implements `iam.IGrantable`,
making it possible to use the `grantXxx()` methods.

As this custom resource uses a singleton Lambda function, it's important to note
that the function's role will eventually accumulate the permissions/grants from all
resources.

Chained API calls can be achieved by creating dependencies:
```ts
const awsCustom1 = new AwsCustomResource(this, 'API1', {
  onCreate: {
    service: '...',
    action: '...',
    physicalResourceId: '...'
  }
});

const awsCustom2 = new AwsCustomResource(this, 'API2', {
  onCreate: {
    service: '...',
    action: '...'
    parameters: {
      text: awsCustom1.getData('Items.0.text')
    },
    physicalResourceId: '...'
  }
})
```

---

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
