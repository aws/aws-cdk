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
  - [Handling Lifecycle Events: onEvent](#handling-lifecycle-events-onevent)
  - [Asynchronous Providers: isComplete](#asynchronous-providers-iscomplete)
  - [Physical Resource IDs](#physical-resource-ids)
  - [Error Handling](#error-handling)
  - [Execution Policy](#execution-policy)
  - [Timeouts](#timeouts)
  - [Examples](#examples)
- [Custom Resources for AWS APIs](#custom-resources-for-aws-apis)
  - [Execution Policy](#execution-policy-1)
  - [Examples](#examples-1)


## Provider Framework

AWS CloudFormation [custom resources] are extension points to the provisioning
engine. When CloudFormation needs to create, update or delete a custom resource,
it sends a lifecycle event notification to a **custom resource provider**. The provider
handles the event (e.g. creates a resource) and sends back a response to CloudFormation.

The `@aws-cdk/custom-resources.Provider` construct is a "mini-framework" for
implementing providers for AWS CloudFormation custom resources. The framework offers a high-level API which makes it easier to implement robust
and powerful custom resources and includes the following capabilities:

* Handles responses to AWS CloudFormation and protects against blocked
  deployments
* Validates handler return values to help with correct handler implementation
* Supports asynchronous handlers to enable long operations which can exceed the AWS Lambda timeout

The following code shows how the `Provider` construct is used in conjunction
with `cfn.CustomResource` and a user-provided AWS Lambda function which
implements the actual handler.

```ts
import cr = require('@aws-cdk/custom-resources');
import cfn = require('@aws-cdk/aws-cloudformation');

const onEvent = new lambda.Function(this, 'MyHandler', { /* ... */ });

const myProvider = new cr.Provider(this, 'MyProvider', {
  onEventHandler: onEvent
});

new cfn.CustomResource(this, 'Resource1', { provider: myProvider });
new cfn.CustomResource(this, 'Resource2', { provider: myProvider });
```

Providers are implemented through AWS Lambda functions that are triggered by the
provider framework in response to lifecycle events.

At the minimum, users must define the `onEvent` handler, which is invoked by the
framework for all resource lifecycle events (`Create`, `Update` and `Delete`)
and returns a result which is then submitted to CloudFormation.

Users may also provide an additional handler called `isComplete`, for cases
where the lifecycle operation cannot be completed immediately. The
`isComplete` handler will be retried asynchronously after `onEvent` until it
returns `IsComplete: true`, or until the total provider timeout has expired.

[custom resources]: (https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html).

### Handling Lifecycle Events: onEvent

The user-defined `onEvent` AWS Lambda function is invoked whenever a resource
lifecycle event occurs. The function is expected to handle the event and return
a response to the framework that, at least, includes the physical resource ID.

If `onEvent` returns successfully, the framework will submit a "SUCCESS" response
to AWS CloudFormation for this resource operation.  If the provider is
[asynchronous](#asynchronous-providers-iscomplete) (`isCompleteHandler` is
defined), the framework will only submit a response based on the result of
`isComplete`. 

If `onEvent` throws an error, the framework will submit a "FAILED" response to
AWS CloudFormation.

The input event includes the following fields derived from the [Custom Resource
Provider Request]:

|Field|Type|Description
|-----|----|----------------
|`RequestType`|String|The type of lifecycle event: `Create`, `Update` or `Delete`.
|`LogicalResourceId`|String|The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template.
|`PhysicalResourceId`|String|This field will only be present for `Update` and `Delete` events and includes the value returned in `PhysicalResourceId` of the previous operation.
|`ResourceProperties`|JSON|This field contains the properties defined in the template for this custom resource.
|`OldResourceProperties`|JSON|This field will only be present for `Update` events and contains the resource properties that were declared previous to the update request.
|`ResourceType`|String|The resource type defined for this custom resource in the template. A provider may handle any number of custom resource types.
|`RequestId`|String|A unique ID for the request.
|`StackId`|String|The ARN that identifies the stack that contains the custom resource.

The return value from `onEvent` must be a JSON object with the following fields:

|Field|Type|Required|Description
|-----|----|--------|-----------
|`PhysicalResourceId`|String|Yes|The allocated/assigned physical ID of the resource. Must be returned for all request types, including `Update` and `Delete`, even if the physical ID hasn't changed.
|`Data`|JSON|No|Resource attributes, which can later be retrieved through `Fn::GetAtt` on the custom resource object.

[Custom Resource Provider Request]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html#crpg-ref-request-fields

### Asynchronous Providers: isComplete

It is not uncommon for the provisioning of resources to be an asynchronous
operation, which means that the operation does not immediately finish, and we
need to "wait" until the resource stabilizes. 

The provider framework makes it easy to implement "waiters" by allowing users to
specify an additional AWS Lambda function in `isCompleteHandler`. 

The framework will repeatedly invoke the handler every `queryInterval`. When
`isComplete` returns with `IsComplete: true`, the framework will submit a
"SUCCESS" response to AWS CloudFormation. If `totalTimeout` expires and the
operation has not yet completed, the framework will submit a "FAILED" response
with the message "Operation timed out".

If an error is thrown, the framework will submit a "FAILED" response to AWS
CloudFormation.

The input event to `isComplete` is similar to [`onEvent`](#handling-lifecycle-events-onevent), 
with an additional guarantee that `PhysicalResourceId` is defines and contains the value returned 
from `onEvent`.

The return value must be a JSON object with the following fields:

|Field|Type|Required|Description
|-----|----|--------|-----------
|`IsComplete`|Boolean|Yes|Indicates if the operation has finished or not.
|`Data`|JSON|No|May only be sent if `IsComplete` is `true` and includes additional resource attributes. These attributes will be **merged** with the ones returned from `onEvent`

### Physical Resource IDs

Every resource in CloudFormation has a physical resource ID. When a resource is
created, the `PhysicalResourceId` returned from the `Create` operation is stored
by AWS CloudFormation and assigned to the logical ID defined for this resource
in the template.

When an `Update` operation occurs, if the returned `PhysicalResourceId` is
different from the one currently stored (and passed in the event through the
`PhysicalResourceId` field), AWS CloudFormation will treat this as a **resource
replacement**, and it will issue a subsequent `Delete` operation for the old
resource.

As a rule of thumb, if your custom resource supports configuring a physical name
(e.g. you can specify a `BucketName` when you define an `AWS::S3::Bucket`), you
must return this name in `PhysicalResourceId` and make sure to handle
replacement properly. The `S3File` example demonstrates this
through the `objectKey` property.

If your custom resource doesn't support configuring a physical name for the
resource, it is safe to use `RequestId` as `PhysicalResourceId` in the `Create`
operation, but you must return the same value in subsequent `Update` operations,
or otherwise CloudFormation will think your resource is being replaced and will
issue a `Delete` event. The `S3Assert` example demonstrates this by returning
`event.PhysicalResourceId` if defined (in `Update` and `Delete`) and otherwise
`event.RequestId` (for `Create`).

### Error Handling

As mentioned above, if any of the user handlers fail (i.e. throws an exception)
or times out (due to their AWS Lambda timing out), the framework will trap these
errors and submit a "FAILED" response to AWS CloudFormation, along with the error
message.

Since errors can occur in multiple places in the provider (framework, `onEvent`,
`isComplete`), it is important to know that there could situations where a
resource operation fails even though the operation technically succeeded (i.e.
isComplete throws an error).

When AWS CloudFormation receives a "FAILED" response, it will attempt to roll
back the stack to it's last state. This has different meanings for different
lifecycle events:

- If a `Create` event fails, CloudFormation will issue a `Delete` event to allow
  the provider to clean up any unfinished work related to the creation of the
  resource. The implication of this is that it is recommended to implement
  `Delete` in an idempotent way, in order to make sure that the rollback
  `Delete` operation won't fail if a resource creation has failed.
- If an `Update` event fails, CloudFormation will issue an additional `Update`
  with the previous properties.
- If a `Delete` event fails, CloudFormation will abandon this resource.

### Execution Policy

Similarly to any AWS Lambda function, if the user-defined handlers require
access to AWS resources, you will have to define these permissions  
by calling "grant" methods such as `myBucket.grantRead(myHandler)`), using `myHandler.addToRolePolicy`
or specifying an `initialPolicy` when defining the function.

Bear in mind that in most cases, a single provider will be used for multiple
resource instances. This means that the execution policy of the provider must
have the appropriate privileges.

The following example grants the `onEvent` handler `s3:GetObject*` permissions
to all buckets:

```ts
new lambda.Function(this, 'OnEventHandler', {
  // ...
  initialPolicy: [
    new iam.PolicyStatement({ actions: [ 's3:GetObject*' ], resources: [ '*' ] })
  ]
});
```

### Timeouts

Users are responsible to define the timeouts for the AWS Lambda functions for
user-defined handlers. It is recommended not to exceed a **14 minutes** timeout,
since all framework functions are configured to time out after 15 minutes, which
is the maximal AWS Lambda timeout.

If your operation takes over **14 minutes**, the recommended approach is to
implement an [asynchronous provider](#asynchronous-providers-iscomplete), and
then configure the timeouts for the asynchronous retries through the
`queryInterval` and the `totalTimeout` options.

### Examples

This module includes a few examples for custom resource implementations:

#### S3File

Provisions an object in an S3 bucket with textual contents. See the source code
for the
[construct](test/provider-framework/integration-test-fixtures/s3-file.ts) and
[handler](test/provider-framework/integration-test-fixtures/s3-file-handler/index.ts).

The following example will create the file `folder/file1.txt` inside `myBucket`
with the contents `hello!`.


```ts
new S3File(this, 'MyFile', {
  bucket: myBucket,
  objectKey: 'folder/file1.txt', // optional
  content: 'hello!',
  public: true // optional
});
```

This sample demonstrates the following concepts:

- Synchronous implementation (`isComplete` is not defined)
- Automatically generates the physical name if `objectKey` is not defined
- Handles physical name changes
- Returns resource attributes
- Handles deletions
- Implemented in TypeScript

#### S3Assert

Checks that the textual contents of an S3 object matches a certain value. The check will be retried for 5 minutes as long as the object is not found or the value is different. See the source code for the [construct](test/provider-framework/integration-test-fixtures/s3-assert.ts) and [handler](test/provider-framework/integration-test-fixtures/s3-assert-handler/index.py).

The following example defines an `S3Assert` resource which waits until
`myfile.txt` in `myBucket` exists and includes the contents `foo bar`:

```ts
new S3Assert(this, 'AssertMyFile', {
  bucket: myBucket,
  objectKey: 'myfile.txt',
  expectedContent: 'foo bar'
});
```

This sample demonstrates the following concepts:

- Asynchronous implementation
- Non-intrinsic physical IDs
- Implemented in Python

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

### Execution Policy

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

### Examples

#### Verify a domain with SES

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

#### Get the latest version of a secure SSM parameter

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



---

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
