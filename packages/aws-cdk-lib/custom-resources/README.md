# AWS CDK Custom Resources


## Provider Framework

AWS CloudFormation [custom resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) are extension points to the provisioning
engine. When CloudFormation needs to create, update or delete a custom resource,
it sends a lifecycle event notification to a **custom resource provider**. The provider
handles the event (e.g. creates a resource) and sends back a response to CloudFormation.

The `@aws-cdk/custom-resources.Provider` construct is a "mini-framework" for
implementing providers for AWS CloudFormation custom resources. The framework offers a high-level API which makes it easier to implement robust
and powerful custom resources. If you are looking to implement a custom resource provider, we recommend
you use this module unless you have good reasons not to. For an overview of different provider types you
could be using, see the [Custom Resource Providers section in the core library documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib-readme.html#custom-resource-providers).

> **N.B.**: if you use the provider framework in this module you will write AWS Lambda Functions that look a lot like, but aren't exactly the same as the Lambda Functions you would write if you wrote CloudFormation Custom Resources directly, without this framework.
>
> Specifically, to report success or failure, have your Lambda Function exit in the right way: return data for success, or throw an
> exception for failure. *Do not* post the success or failure of your custom resource to an HTTPS URL as the CloudFormation
> documentation tells you to do.

The framework has the following capabilities:

* Handles responses to AWS CloudFormation and protects against blocked
  deployments
* Validates handler return values to help with correct handler implementation
* Supports asynchronous handlers to enable operations that require a long waiting period for a resource, which can exceed the AWS Lambda timeout
* Implements default behavior for physical resource IDs.

The following code shows how the `Provider` construct is used in conjunction
with a `CustomResource` and a user-provided AWS Lambda function which implements
the actual handler.

```ts
declare const onEvent: lambda.Function;
declare const isComplete: lambda.Function;
declare const myRole: iam.Role;

const myProvider = new cr.Provider(this, 'MyProvider', {
  onEventHandler: onEvent,
  isCompleteHandler: isComplete,        // optional async "waiter"
  logRetention: logs.RetentionDays.ONE_DAY,   // default is INFINITE
  role: myRole, // must be assumable by the `lambda.amazonaws.com` service principal
});

new CustomResource(this, 'Resource1', { serviceToken: myProvider.serviceToken });
new CustomResource(this, 'Resource2', { serviceToken: myProvider.serviceToken });
```

Providers are implemented through AWS Lambda functions that are triggered by the
provider framework in response to lifecycle events.

At the minimum, users must define the `onEvent` handler, which is invoked by the
framework for all resource lifecycle events (`Create`, `Update` and `Delete`)
and returns a result which is then submitted to CloudFormation.

The following example is a skeleton for a Python implementation of `onEvent`:

```py
def on_event(event, context):
  print(event)
  request_type = event['RequestType']
  if request_type == 'Create': return on_create(event)
  if request_type == 'Update': return on_update(event)
  if request_type == 'Delete': return on_delete(event)
  raise Exception("Invalid request type: %s" % request_type)

def on_create(event):
  props = event["ResourceProperties"]
  print("create new resource with props %s" % props)

  # add your create code here...
  physical_id = ...

  return { 'PhysicalResourceId': physical_id }

def on_update(event):
  physical_id = event["PhysicalResourceId"]
  props = event["ResourceProperties"]
  print("update resource %s with props %s" % (physical_id, props))
  # ...

def on_delete(event):
  physical_id = event["PhysicalResourceId"]
  print("delete resource %s" % physical_id)
  # ...
```

> When writing your handlers, there are a couple of non-obvious corner cases you need to
> pay attention to. See the [important cases to handle](#important-cases-to-handle) section for more information.

Users may also provide an additional handler called `isComplete`, for cases
where the lifecycle operation cannot be completed immediately. The
`isComplete` handler will be retried asynchronously after `onEvent` until it
returns `IsComplete: true`, or until the total provider timeout has expired.

The following example is a skeleton for a Python implementation of `isComplete`:

```py
def is_complete(event, context):
  physical_id = event["PhysicalResourceId"]
  request_type = event["RequestType"]

  # check if resource is stable based on request_type
  is_ready = ...

  return { 'IsComplete': is_ready }
```

> **Security Note**: the Custom Resource Provider Framework will write the value of `ResponseURL`,
> which is a pre-signed S3 URL used to report the success or failure of the Custom Resource execution
> back to CloudFormation, in a readable form to the AWS Step Functions execution history.
>
> Anybody who can list and read AWS StepFunction executions in your account will be able to write
> a fake response to this URL and make your CloudFormation deployments fail.
>
> Do not use this library if your threat model requires that you cannot trust actors who are able
> to list StepFunction executions in your account.

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
|`PhysicalResourceId`|String|No|The allocated/assigned physical ID of the resource. If omitted for `Create` events, the event's `RequestId` will be used. For `Update`, the current physical ID will be used. If a different value is returned, CloudFormation will follow with a subsequent `Delete` for the previous ID (resource replacement). For `Delete`, it will always return the current physical resource ID, and if the user returns a different one, an error will occur.
|`Data`|JSON|No|Resource attributes, which can later be retrieved through `Fn::GetAtt` on the custom resource object.
|`NoEcho`|Boolean|No|Whether to mask the output of the custom resource when retrieved by using the `Fn::GetAtt` function.
|*any*|*any*|No|Any other field included in the response will be passed through to `isComplete`. This can sometimes be useful to pass state between the handlers.

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

The input event to `isComplete` includes all request fields, combined with all
fields returned from `onEvent`. If `PhysicalResourceId` has not been explicitly
returned from `onEvent`, it's value will be calculated based on the heuristics
described above.

The return value must be a JSON object with the following fields:

|Field|Type|Required|Description
|-----|----|--------|-----------
|`IsComplete`|Boolean|Yes|Indicates if the operation has finished or not.
|`Data`|JSON|No|May only be sent if `IsComplete` is `true` and includes additional resource attributes. These attributes will be **merged** with the ones returned from `onEvent`

### Physical Resource IDs

Every resource in CloudFormation has a physical resource ID. When a resource is
created, the `PhysicalResourceId` returned from the `Create` operation is stored
by AWS CloudFormation and assigned to the logical ID defined for this resource
in the template. If a `Create` operation returns without a `PhysicalResourceId`,
the framework will use `RequestId` as the default. This is sufficient for
various cases such as "pseudo-resources" which only query data.

For `Update` and `Delete` operations, the resource event will always include the
current `PhysicalResourceId` of the resource.

When an `Update` operation occurs, the default behavior is to return the current
physical resource ID. if the `onEvent` returns a `PhysicalResourceId` which is
different from the current one, AWS CloudFormation will treat this as a
**resource replacement**, and it will issue a subsequent `Delete` operation for
the old resource.

As a rule of thumb, if your custom resource supports configuring a physical name
(e.g. you can specify a `BucketName` when you define an `AWS::S3::Bucket`), you
must return this name in `PhysicalResourceId` and make sure to handle
replacement properly. The `S3File` example demonstrates this
through the `objectKey` property.

### When there are errors

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

* If a `Create` event fails, the resource provider framework will automatically
  ignore the subsequent `Delete` operation issued by AWS CloudFormation. The
  framework currently does not support customizing this behavior (see
  https://github.com/aws/aws-cdk/issues/5524).
* If an `Update` event fails, CloudFormation will issue an additional `Update`
  with the previous properties.
* If a `Delete` event fails, CloudFormation will abandon this resource.

### Important cases to handle

You should keep the following list in mind when writing custom resources to
make sure your custom resource behaves correctly in all cases:

* During `Create`:
  * If the create fails, the *provider framework* will make sure you
    don't get a subsequent `Delete` event. If your create involves multiple distinct
    operations, it is your responsibility to catch and rethrow and clean up
    any partial updates that have already been performed. Make sure your
    API call timeouts and Lambda timeouts allow for this.
* During `Update`:
  * If the update fails, you will get a subsequent `Update` event
    to roll back to the previous state (with `ResourceProperties` and
    `OldResourceProperties` reversed).
  * If you return a different `PhysicalResourceId`, you will subsequently
    receive a `Delete` event to clean up the previous state of the resource.
* During `Delete`:
  * If the behavior of your custom resource is tied to another AWS resource
    (for example, it exists to clean the contents of a stateful resource), keep
    in mind that your custom resource may be deleted independently of the other
    resource and you must confirm that it is appropriate to perform the action.
  * (only if you are *not* using the provider framework) a `Delete` event
    may be caused by a failed `Create`. You must be able to handle the case
    where the resource you are trying to delete hasn't even been created yet.
* If you update the code of your custom resource and change the format of the
  resource properties, be aware that there may still be already-deployed
  instances of your custom resource out there, and you may still receive
  the *old* property format in `ResourceProperties` (during `Delete` and
  rollback `Updates`) or in `OldResourceProperties` (during rollforward
  `Update`). You must continue to handle all possible sets of properties
  your custom resource could have ever been created with in the past.

### Provider Framework Execution Policy

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
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('my code'),
  initialPolicy: [
    new iam.PolicyStatement({ actions: [ 's3:GetObject*' ], resources: [ '*' ] }),
  ],
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

### Provider Framework Examples

This module includes a few examples for custom resource implementations:

#### S3File

Provisions an object in an S3 bucket with textual contents. See the source code
for the
[construct](https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/custom-resources/test/provider-framework/integration-test-fixtures/s3-file.ts) and
[handler](https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/custom-resources/test/provider-framework/integration-test-fixtures/s3-file-handler/index.ts).

The following example will create the file `folder/file1.txt` inside `myBucket`
with the contents `hello!`.


```plaintext
// This example exists only for TypeScript

declare const myBucket: s3.Bucket;
new cr.S3File(this, 'MyFile', {
  bucket: myBucket,
  objectKey: 'folder/file1.txt', // optional
  content: 'hello!',
  public: true, // optional
});
```

This sample demonstrates the following concepts:

* Synchronous implementation (`isComplete` is not defined)
* Automatically generates the physical name if `objectKey` is not defined
* Handles physical name changes
* Returns resource attributes
* Handles deletions
* Implemented in TypeScript

#### S3Assert

Checks that the textual contents of an S3 object matches a certain value. The check will be retried for 5 minutes as long as the object is not found or the value is different. See the source code for the [construct](test/provider-framework/integration-test-fixtures/s3-assert.ts) and [handler](test/provider-framework/integration-test-fixtures/s3-assert-handler/index.py).

The following example defines an `S3Assert` resource which waits until
`myfile.txt` in `myBucket` exists and includes the contents `foo bar`:

```plaintext
// This example exists only for TypeScript

declare const myBucket: s3.Bucket;
new cr.S3Assert(this, 'AssertMyFile', {
  bucket: myBucket,
  objectKey: 'myfile.txt',
  expectedContent: 'foo bar',
});
```

This sample demonstrates the following concepts:

* Asynchronous implementation
* Non-intrinsic physical IDs
* Implemented in Python


### Customizing Provider Function name

In multi-account environments or when the custom resource may be re-utilized across several
stacks it may be useful to manually set a name for the Provider Function Lambda and therefore
have a predefined service token ARN.

```ts
declare const onEvent: lambda.Function;
declare const isComplete: lambda.Function;
declare const myRole: iam.Role;
const myProvider = new cr.Provider(this, 'MyProvider', {
  onEventHandler: onEvent,
  isCompleteHandler: isComplete,
  logRetention: logs.RetentionDays.ONE_DAY,
  role: myRole,
  providerFunctionName: 'the-lambda-name',   // Optional
});

```

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

To make sure that the newest API calls are available the latest AWS SDK v2 is installed
in the Lambda function implementing the custom resource. The installation takes around 60
seconds. If you prefer to optimize for speed, you can disable the installation by setting
the `installLatestAwsSdk` prop to `false`.

### Custom Resource Execution Policy

The `policy` property defines the IAM Policy that will be applied to the API calls. This must be provided
if an existing `role` is not specified and is optional otherwise. The library provides two factory methods
to quickly configure this:

* **`AwsCustomResourcePolicy.fromSdkCalls`** - Use this to auto-generate IAM
  Policy statements based on the configured SDK calls. Keep two things in mind
  when using this policy:
  * This policy variant assumes the IAM policy name has the same name as the API
    call. This is true in 99% of cases, but there are exceptions (for example,
    S3's `PutBucketLifecycleConfiguration` requires
    `s3:PutLifecycleConfiguration` permissions, Lambda's `Invoke` requires
    `lambda:InvokeFunction` permissions). Use `fromStatements` if you want to
    do a call that requires different IAM action names.
  * You will have to either provide specific ARNs, or explicitly use
    `AwsCustomResourcePolicy.ANY_RESOURCE` to allow access to any resource.
* **`AwsCustomResourcePolicy.fromStatements`** - Use this to specify your own
  custom statements.

The custom resource also implements `iam.IGrantable`, making it possible to use the `grantXxx()` methods.

As this custom resource uses a singleton Lambda function, it's important to note
that the function's role will eventually accumulate the permissions/grants from all
resources.

Chained API calls can be achieved by creating dependencies:

```ts
const awsCustom1 = new cr.AwsCustomResource(this, 'API1', {
  onCreate: {
    service: '...',
    action: '...',
    physicalResourceId: cr.PhysicalResourceId.of('...'),
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});

const awsCustom2 = new cr.AwsCustomResource(this, 'API2', {
  onCreate: {
    service: '...',
    action: '...',
    parameters: {
      text: awsCustom1.getResponseField('Items.0.text'),
    },
    physicalResourceId: cr.PhysicalResourceId.of('...'),
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});
```

### Physical Resource Id Parameter

Some AWS APIs may require passing the physical resource id in as a parameter for doing updates and deletes. You can pass it by using `PhysicalResourceIdReference`.

```ts
const awsCustom = new cr.AwsCustomResource(this, 'aws-custom', {
  onCreate: {
    service: '...',
    action: '...',
    parameters: {
      text: '...',
    },
    physicalResourceId: cr.PhysicalResourceId.of('...'),
  },
  onUpdate: {
    service: '...',
    action: '...',
    parameters: {
      text: '...',
      resourceId: new cr.PhysicalResourceIdReference(),
    },
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
})
```

You can omit `PhysicalResourceId` property in `onUpdate` to passthrough the value in `onCreate`. This behavior is useful when using Update APIs that response with an empty body.

> AwsCustomResource.getResponseField() and .getResponseFieldReference() will not work if the Create and Update APIs don't consistently return the same fields.

### Handling Custom Resource Errors

Every error produced by the API call is treated as is and will cause a "FAILED" response to be submitted to CloudFormation.
You can ignore some errors by specifying the `ignoreErrorCodesMatching` property, which accepts a regular expression that is
tested against the `code` property of the response. If matched, a "SUCCESS" response is submitted.
Note that in such a case, the call response data and the `Data` key submitted to CloudFormation would both be an empty JSON object.
Since a successful resource provisioning might or might not produce outputs, this presents us with some limitations:

* `PhysicalResourceId.fromResponse` - Since the call response data might be empty, we cannot use it to extract the physical id.
* `getResponseField` and `getResponseFieldReference` - Since the `Data` key is empty, the resource will not have any attributes, and therefore, invoking these functions will result in an error.

In both the cases, you will get a synth time error if you attempt to use it in conjunction with `ignoreErrorCodesMatching`.

### Customizing the Lambda function implementing the custom resource

Use the `role`, `timeout`, `logRetention` and `functionName` properties to customize
the Lambda function implementing the custom resource:

```ts
declare const myRole: iam.Role;
new cr.AwsCustomResource(this, 'Customized', {
  role: myRole, // must be assumable by the `lambda.amazonaws.com` service principal
  timeout: Duration.minutes(10), // defaults to 2 minutes
  logRetention: logs.RetentionDays.ONE_WEEK, // defaults to never delete logs
  functionName: 'my-custom-name', // defaults to a CloudFormation generated name
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});
```

Additionally, the Lambda function can be placed in a private VPC by using the `vpc`
and `vpcSubnets` properties.

```ts
declare const myVpc: ec2.Vpc;
new cr.AwsCustomResource(this, 'CustomizedInVpc', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_NAT },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }
})
```

Note that Lambda functions in a VPC
[require Network Address Translation (NAT) in order to access the internet][vpc-internet].
The subnets specified in `vpcSubnets` must be private subnets.

[vpc-internet]: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html#vpc-internet

### Restricting the output of the Custom Resource

CloudFormation imposes a hard limit of 4096 bytes for custom resources response
objects. If your API call returns an object that exceeds this limit, you can restrict
the data returned by the custom resource to specific paths in the API response:

```ts
new cr.AwsCustomResource(this, 'ListObjects', {
  onCreate: {
    service: 's3',
    action: 'listObjectsV2',
    parameters: {
      Bucket: 'my-bucket',
    },
    physicalResourceId: cr.PhysicalResourceId.of('id'),
    outputPaths: ['Contents.0.Key', 'Contents.1.Key'], // Output only the two first keys
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});
```

Note that even if you restrict the output of your custom resource you can still use any
path in `PhysicalResourceId.fromResponse()`.

### Custom Resource Examples

#### Get the latest version of a secure SSM parameter

```ts
const getParameter = new cr.AwsCustomResource(this, 'GetParameter', {
  onUpdate: { // will also be called for a CREATE event
    service: 'SSM',
    action: 'getParameter',
    parameters: {
      Name: 'my-parameter',
      WithDecryption: true,
    },
    physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()), // Update physical id to always fetch the latest version
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});

// Use the value in another construct with
getParameter.getResponseField('Parameter.Value');
```

#### Associate a PrivateHostedZone with VPC shared from another account

```ts
const getParameter = new cr.AwsCustomResource(this, 'AssociateVPCWithHostedZone', {
  onCreate: {
    assumedRoleArn: 'arn:aws:iam::OTHERACCOUNT:role/CrossAccount/ManageHostedZoneConnections',
    service: 'Route53',
    action: 'associateVPCWithHostedZone',
    parameters: {
      HostedZoneId: 'hz-123',
      VPC: {
		    VPCId: 'vpc-123',
		    VPCRegion: 'region-for-vpc',
      },
    },
    physicalResourceId: cr.PhysicalResourceId.of('${vpcStack.SharedVpc.VpcId}-${vpcStack.Region}-${PrivateHostedZone.HostedZoneId}'),
  },
  //Will ignore any resource and use the assumedRoleArn as resource and 'sts:AssumeRole' for service:action
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
  }),
});
```

---

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
