# AWS Cloud Development Kit Library

The AWS CDK construct library provides APIs to define your CDK application and add
CDK constructs to the application.

## Usage

### Upgrade from CDK 1.x

When upgrading from CDK 1.x, remove all dependencies to individual CDK packages
from your dependencies file and follow the rest of the sections.

### Installation

To use this package, you need to declare this package and the `constructs` package as
dependencies.

According to the kind of project you are developing:

For projects that are CDK libraries in NPM, declare them both under the `devDependencies` **and** `peerDependencies` sections.
To make sure your library is compatible with the widest range of CDK versions: pick the minimum `aws-cdk-lib` version
that your library requires; declare a range dependency with a caret on that version in peerDependencies, and declare a
point version dependency on that version in devDependencies.

For example, let's say the minimum version your library needs is `2.38.0`. Your `package.json` should look like this:

```javascript
{
  "peerDependencies": {
    "aws-cdk-lib": "^2.38.0",
    "constructs": "^10.0.0"
  },
  "devDependencies": {
    /* Install the oldest version for testing so we don't accidentally use features from a newer version than we declare */
    "aws-cdk-lib": "2.38.0"
  }
}
```

For CDK apps, declare them under the `dependencies` section. Use a caret so you always get the latest version:

```json
{
  "dependencies": {
    "aws-cdk-lib": "^2.38.0",
    "constructs": "^10.0.0"
  }
}
```


### Use in your code

#### Classic import

You can use a classic import to get access to each service namespaces:

```ts nofixture
import { Stack, App, aws_s3 as s3 } from 'aws-cdk-lib';

const app = new App();
const stack = new Stack(app, 'TestStack');

new s3.Bucket(stack, 'TestBucket');
```

#### Barrel import

Alternatively, you can use "barrel" imports:

```ts nofixture
import { App, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'TestStack');

new Bucket(stack, 'TestBucket');
```

<!--BEGIN CORE DOCUMENTATION-->

## Stacks and Stages

A `Stack` is the smallest physical unit of deployment, and maps directly onto
a CloudFormation Stack. You define a Stack by defining a subclass of `Stack`
-- let's call it `MyStack` -- and instantiating the constructs that make up
your application in `MyStack`'s constructor. You then instantiate this stack
one or more times to define different instances of your application. For example,
you can instantiate it once using few and cheap EC2 instances for testing,
and once again using more and bigger EC2 instances for production.

When your application grows, you may decide that it makes more sense to split it
out across multiple `Stack` classes. This can happen for a number of reasons:

- You could be starting to reach the maximum number of resources allowed in a single
  stack (this is currently 500).
- You could decide you want to separate out stateful resources and stateless resources
  into separate stacks, so that it becomes easy to tear down and recreate the stacks
  that don't have stateful resources.
- There could be a single stack with resources (like a VPC) that are shared
  between multiple instances of other stacks containing your applications.

As soon as your conceptual application starts to encompass multiple stacks,
it is convenient to wrap them in another construct that represents your
logical application. You can then treat that new unit the same way you used
to be able to treat a single stack: by instantiating it multiple times
for different instances of your application.

You can define a custom subclass of `Stage`, holding one or more
`Stack`s, to represent a single logical instance of your application.

As a final note: `Stack`s are not a unit of reuse. They describe physical
deployment layouts, and as such are best left to application builders to
organize their deployments with. If you want to vend a reusable construct,
define it as a subclasses of `Construct`: the consumers of your construct
will decide where to place it in their own stacks.

## Stack Synthesizers

Each Stack has a *synthesizer*, an object that determines how and where
the Stack should be synthesized and deployed. The synthesizer controls
aspects like:

- How does the stack reference assets? (Either through CloudFormation
  parameters the CLI supplies, or because the Stack knows a predefined
  location where assets will be uploaded).
- What roles are used to deploy the stack? These can be bootstrapped
  roles, roles created in some other way, or just the CLI's current
  credentials.

The following synthesizers are available:

- `DefaultStackSynthesizer`: recommended. Uses predefined asset locations and
  roles created by the modern bootstrap template. Access control is done by
  controlling who can assume the deploy role. This is the default stack
  synthesizer in CDKv2.
- `LegacyStackSynthesizer`: Uses CloudFormation parameters to communicate
  asset locations, and the CLI's current permissions to deploy stacks. This
  is the default stack synthesizer in CDKv1.
- `CliCredentialsStackSynthesizer`: Uses predefined asset locations, and the
  CLI's current permissions.

Each of these synthesizers takes configuration arguments. To configure
a stack with a synthesizer, pass it as one of its properties:

```ts
new MyStack(app, 'MyStack', {
  synthesizer: new DefaultStackSynthesizer({
    fileAssetsBucketName: 'my-orgs-asset-bucket',
  }),
});
```

For more information on bootstrapping accounts and customizing synthesis,
see [Bootstrapping in the CDK Developer Guide](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html).

## Nested Stacks

[Nested stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html) are stacks created as part of other stacks. You create a nested stack within another stack by using the `NestedStack` construct.

As your infrastructure grows, common patterns can emerge in which you declare the same components in multiple templates. You can separate out these common components and create dedicated templates for them. Then use the resource in your template to reference other templates, creating nested stacks.

For example, assume that you have a load balancer configuration that you use for most of your stacks. Instead of copying and pasting the same configurations into your templates, you can create a dedicated template for the load balancer. Then, you just use the resource to reference that template from within other templates.

The following example will define a single top-level stack that contains two nested stacks: each one with a single Amazon S3 bucket:

```ts
class MyNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, props?: cfn.NestedStackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'NestedBucket');
  }
}

class MyParentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new MyNestedStack(this, 'Nested1');
    new MyNestedStack(this, 'Nested2');
  }
}
```

Resources references across nested/parent boundaries (even with multiple levels of nesting) will be wired by the AWS CDK
through CloudFormation parameters and outputs. When a resource from a parent stack is referenced by a nested stack,
a CloudFormation parameter will automatically be added to the nested stack and assigned from the parent; when a resource
from a nested stack is referenced by a parent stack, a CloudFormation output will be automatically be added to the
nested stack and referenced using `Fn::GetAtt "Outputs.Xxx"` from the parent.

Nested stacks also support the use of Docker image and file assets.

## Accessing resources in a different stack

You can access resources in a different stack, as long as they are in the
same account and AWS Region (see [next section](#accessing-resources-in-a-different-stack-and-region) for an exception).
The following example defines the stack `stack1`,
which defines an Amazon S3 bucket. Then it defines a second stack, `stack2`,
which takes the bucket from stack1 as a constructor property.

```ts
const prod = { account: '123456789012', region: 'us-east-1' };

const stack1 = new StackThatProvidesABucket(app, 'Stack1' , { env: prod });

// stack2 will take a property { bucket: IBucket }
const stack2 = new StackThatExpectsABucket(app, 'Stack2', {
  bucket: stack1.bucket,
  env: prod
});
```

If the AWS CDK determines that the resource is in the same account and
Region, but in a different stack, it automatically synthesizes AWS
CloudFormation
[Exports](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-exports.html)
in the producing stack and an
[Fn::ImportValue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html)
in the consuming stack to transfer that information from one stack to the
other.

## Accessing resources in a different stack and region

> **This feature is currently experimental**

You can enable the Stack property `crossRegionReferences`
in order to access resources in a different stack _and_ region. With this feature flag
enabled it is possible to do something like creating a CloudFront distribution in `us-east-2` and
an ACM certificate in `us-east-1`.

```ts
const stack1 = new Stack(app, 'Stack1', {
  env: {
    region: 'us-east-1',
  },
  crossRegionReferences: true,
});
const cert = new acm.Certificate(stack1, 'Cert', {
  domainName: '*.example.com',
  validation: acm.CertificateValidation.fromDns(route53.PublicHostedZone.fromHostedZoneId(stack1, 'Zone', 'Z0329774B51CGXTDQV3X')),
});

const stack2 = new Stack(app, 'Stack2', {
  env: {
    region: 'us-east-2',
  },
  crossRegionReferences: true,
});
new cloudfront.Distribution(stack2, 'Distribution', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('example.com'),
  },
  domainNames: ['dev.example.com'],
  certificate: cert,
});
```

When the AWS CDK determines that the resource is in a different stack _and_ is in a different
region, it will "export" the value by creating a custom resource in the producing stack which
creates SSM Parameters in the consuming region for each exported value. The parameters will be
created with the name '/cdk/exports/${consumingStackName}/${export-name}'.
In order to "import" the exports into the consuming stack a [SSM Dynamic reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-ssm)
is used to reference the SSM parameter which was created.

In order to mimic strong references, a Custom Resource is also created in the consuming
stack which marks the SSM parameters as being "imported". When a parameter has been successfully
imported, the producing stack cannot update the value.

See the [adr](https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/core/adr/cross-region-stack-references)
for more details on this feature.

### Removing automatic cross-stack references

The automatic references created by CDK when you use resources across stacks
are convenient, but may block your deployments if you want to remove the
resources that are referenced in this way. You will see an error like:

```text
Export Stack1:ExportsOutputFnGetAtt-****** cannot be deleted as it is in use by Stack1
```

Let's say there is a Bucket in the `stack1`, and the `stack2` references its
`bucket.bucketName`. You now want to remove the bucket and run into the error above.

It's not safe to remove `stack1.bucket` while `stack2` is still using it, so
unblocking yourself from this is a two-step process. This is how it works:

DEPLOYMENT 1: break the relationship

- Make sure `stack2` no longer references `bucket.bucketName` (maybe the consumer
  stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
  remove the Lambda Function altogether).
- In the `stack1` class, call `this.exportValue(this.bucket.bucketName)`. This
  will make sure the CloudFormation Export continues to exist while the relationship
  between the two stacks is being broken.
- Deploy (this will effectively only change the `stack2`, but it's safe to deploy both).

DEPLOYMENT 2: remove the resource

- You are now free to remove the `bucket` resource from `stack1`.
- Don't forget to remove the `exportValue()` call as well.
- Deploy again (this time only the `stack1` will be changed -- the bucket will be deleted).

## Durations

To make specifications of time intervals unambiguous, a single class called
`Duration` is used throughout the AWS Construct Library by all constructs
that that take a time interval as a parameter (be it for a timeout, a
rate, or something else).

An instance of Duration is constructed by using one of the static factory
methods on it:

```ts
Duration.seconds(300)   // 5 minutes
Duration.minutes(5)     // 5 minutes
Duration.hours(1)       // 1 hour
Duration.days(7)        // 7 days
Duration.parse('PT5M')  // 5 minutes
```

Durations can be added or subtracted together:

```ts
Duration.minutes(1).plus(Duration.seconds(60)); // 2 minutes
Duration.minutes(5).minus(Duration.seconds(10)); // 290 secondes
```

## Size (Digital Information Quantity)

To make specification of digital storage quantities unambiguous, a class called
`Size` is available.

An instance of `Size` is initialized through one of its static factory methods:

```ts
Size.kibibytes(200) // 200 KiB
Size.mebibytes(5)   // 5 MiB
Size.gibibytes(40)  // 40 GiB
Size.tebibytes(200) // 200 TiB
Size.pebibytes(3)   // 3 PiB
```

Instances of `Size` created with one of the units can be converted into others.
By default, conversion to a higher unit will fail if the conversion does not produce
a whole number. This can be overridden by unsetting `integral` property.

```ts
Size.mebibytes(2).toKibibytes()                                             // yields 2048
Size.kibibytes(2050).toMebibytes({ rounding: SizeRoundingBehavior.FLOOR })  // yields 2
```

## Secrets

To help avoid accidental storage of secrets as plain text, we use the `SecretValue` type to
represent secrets. Any construct that takes a value that should be a secret (such as
a password or an access key) will take a parameter of type `SecretValue`.

The best practice is to store secrets in AWS Secrets Manager and reference them using `SecretValue.secretsManager`:

```ts
const secret = SecretValue.secretsManager('secretId', {
  jsonField: 'password', // optional: key of a JSON field to retrieve (defaults to all content),
  versionId: 'id',       // optional: id of the version (default AWSCURRENT)
  versionStage: 'stage', // optional: version stage name (default AWSCURRENT)
});
```

Using AWS Secrets Manager is the recommended way to reference secrets in a CDK app.
`SecretValue` also supports the following secret sources:

- `SecretValue.unsafePlainText(secret)`: stores the secret as plain text in your app and the resulting template (not recommended).
- `SecretValue.secretsManager(secret)`: refers to a secret stored in Secrets Manager
- `SecretValue.ssmSecure(param, version)`: refers to a secret stored as a SecureString in the SSM
 Parameter Store. If you don't specify the exact version, AWS CloudFormation uses the latest
 version of the parameter.
- `SecretValue.cfnParameter(param)`: refers to a secret passed through a CloudFormation parameter (must have `NoEcho: true`).
- `SecretValue.cfnDynamicReference(dynref)`: refers to a secret described by a CloudFormation dynamic reference (used by `ssmSecure` and `secretsManager`).
- `SecretValue.resourceAttribute(attr)`: refers to a secret returned from a CloudFormation resource creation.

`SecretValue`s should only be passed to constructs that accept properties of type
`SecretValue`. These constructs are written to ensure your secrets will not be
exposed where they shouldn't be. If you try to use a `SecretValue` in a
different location, an error about unsafe secret usage will be thrown at
synthesis time.

If you rotate the secret's value in Secrets Manager, you must also change at
least one property on the resource where you are using the secret, to force
CloudFormation to re-read the secret.

`SecretValue.ssmSecure()` is only supported for a limited set of resources.
[Click here for a list of supported resources and properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#template-parameters-dynamic-patterns-resources).

## ARN manipulation

Sometimes you will need to put together or pick apart Amazon Resource Names
(ARNs). The functions `stack.formatArn()` and `stack.splitArn()` exist for
this purpose.

`formatArn()` can be used to build an ARN from components. It will automatically
use the region and account of the stack you're calling it on:

```ts
declare const stack: Stack;

// Builds "arn:<PARTITION>:lambda:<REGION>:<ACCOUNT>:function:MyFunction"
stack.formatArn({
  service: 'lambda',
  resource: 'function',
  arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  resourceName: 'MyFunction'
});
```

`splitArn()` can be used to get a single component from an ARN. `splitArn()`
will correctly deal with both literal ARNs and deploy-time values (tokens),
but in case of a deploy-time value be aware that the result will be another
deploy-time value which cannot be inspected in the CDK application.

```ts
declare const stack: Stack;

// Extracts the function name out of an AWS Lambda Function ARN
const arnComponents = stack.splitArn(arn, ArnFormat.COLON_RESOURCE_NAME);
const functionName = arnComponents.resourceName;
```

Note that the format of the resource separator depends on the service and
may be any of the values supported by `ArnFormat`. When dealing with these
functions, it is important to know the format of the ARN you are dealing with.

For an exhaustive list of ARN formats used in AWS, see [AWS ARNs and
Namespaces](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html)
in the AWS General Reference.

## Dependencies

### Construct Dependencies

Sometimes AWS resources depend on other resources, and the creation of one
resource must be completed before the next one can be started.

In general, CloudFormation will correctly infer the dependency relationship
between resources based on the property values that are used. In the cases where
it doesn't, the AWS Construct Library will add the dependency relationship for
you.

If you need to add an ordering dependency that is not automatically inferred,
you do so by adding a dependency relationship using
`constructA.node.addDependency(constructB)`. This will add a dependency
relationship between all resources in the scope of `constructA` and all
resources in the scope of `constructB`.

If you want a single object to represent a set of constructs that are not
necessarily in the same scope, you can use a `DependencyGroup`. The
following creates a single object that represents a dependency on two
constructs, `constructB` and `constructC`:

```ts
// Declare the dependable object
const bAndC = new DependencyGroup();
bAndC.add(constructB);
bAndC.add(constructC);

// Take the dependency
constructA.node.addDependency(bAndC);
```

### Stack Dependencies

Two different stack instances can have a dependency on one another. This
happens when an resource from one stack is referenced in another stack. In
that case, CDK records the cross-stack referencing of resources,
automatically produces the right CloudFormation primitives, and adds a
dependency between the two stacks. You can also manually add a dependency
between two stacks by using the `stackA.addDependency(stackB)` method.

A stack dependency has the following implications:

- Cyclic dependencies are not allowed, so if `stackA` is using resources from
  `stackB`, the reverse is not possible anymore.
- Stacks with dependencies between them are treated specially by the CDK
  toolkit:
  - If `stackA` depends on `stackB`, running `cdk deploy stackA` will also
    automatically deploy `stackB`.
  - `stackB`'s deployment will be performed *before* `stackA`'s deployment.

### CfnResource Dependencies

To make declaring dependencies between `CfnResource` objects easier, you can declare dependencies from one `CfnResource` object on another by using the `cfnResource1.addDependency(cfnResource2)` method. This method will work for resources both within the same stack and across stacks as it detects the relative location of the two resources and adds the dependency either to the resource or between the relevant stacks, as appropriate. If more complex logic is in needed, you can similarly remove, replace, or view dependencies between `CfnResource` objects with the `CfnResource` `removeDependency`, `replaceDependency`, and `obtainDependencies` methods, respectively.

## Custom Resources

Custom Resources are CloudFormation resources that are implemented by arbitrary
user code. They can do arbitrary lookups or modifications during a
CloudFormation deployment.

Custom resources are backed by *custom resource providers*. Commonly, these are
Lambda Functions that are deployed in the same deployment as the one that
defines the custom resource itself, but they can also be backed by Lambda
Functions deployed previously, or code responding to SNS Topic events running on
EC2 instances in a completely different account. For more information on custom
resource providers, see the next section.

Once you have a provider, each definition of a `CustomResource` construct
represents one invocation. A single provider can be used for the implementation
of arbitrarily many custom resource definitions. A single definition looks like
this:

```ts
new CustomResource(this, 'MyMagicalResource', {
  resourceType: 'Custom::MyCustomResource', // must start with 'Custom::'

  // the resource properties
  properties: {
    Property1: 'foo',
    Property2: 'bar'
  },

  // the ARN of the provider (SNS/Lambda) which handles
  // CREATE, UPDATE or DELETE events for this resource type
  // see next section for details
  serviceToken: 'ARN'
});
```

### Custom Resource Providers

Custom resources are backed by a **custom resource provider** which can be
implemented in one of the following ways. The following table compares the
various provider types (ordered from low-level to high-level):

| Provider                                                             | Compute Type | Error Handling | Submit to CloudFormation |   Max Timeout   | Language | Footprint |
| -------------------------------------------------------------------- | :----------: | :------------: | :----------------------: | :-------------: | :------: | :-------: |
| [sns.Topic](#amazon-sns-topic)                                       | Self-managed |     Manual     |          Manual          |    Unlimited    |   Any    |  Depends  |
| [lambda.Function](#aws-lambda-function)                              |  AWS Lambda  |     Manual     |          Manual          |      15min      |   Any    |   Small   |
| [core.CustomResourceProvider](#the-corecustomresourceprovider-class) |  AWS Lambda  |      Auto      |           Auto           |      15min      | Node.js  |   Small   |
| [custom-resources.Provider](#the-custom-resource-provider-framework) |  AWS Lambda  |      Auto      |           Auto           | Unlimited Async |   Any    |   Large   |

Legend:

- **Compute type**: which type of compute can be used to execute the handler.
- **Error Handling**: whether errors thrown by handler code are automatically
  trapped and a FAILED response is submitted to CloudFormation. If this is
  "Manual", developers must take care of trapping errors. Otherwise, events
  could cause stacks to hang.
- **Submit to CloudFormation**: whether the framework takes care of submitting
  SUCCESS/FAILED responses to CloudFormation through the event's response URL.
- **Max Timeout**: maximum allows/possible timeout.
- **Language**: which programming languages can be used to implement handlers.
- **Footprint**: how many resources are used by the provider framework itself.

**A NOTE ABOUT SINGLETONS**

When defining resources for a custom resource provider, you will likely want to
define them as a *stack singleton* so that only a single instance of the
provider is created in your stack and which is used by all custom resources of
that type.

Here is a basic pattern for defining stack singletons in the CDK. The following
examples ensures that only a single SNS topic is defined:

```ts
function getOrCreate(scope: Construct): sns.Topic {
  const stack = Stack.of(scope);
  const uniqueid = 'GloballyUniqueIdForSingleton'; // For example, a UUID from `uuidgen`
  const existing = stack.node.tryFindChild(uniqueid);
  if (existing) {
    return existing as sns.Topic;
  }
  return new sns.Topic(stack, uniqueid);
}
```

#### Amazon SNS Topic

Every time a resource event occurs (CREATE/UPDATE/DELETE), an SNS notification
is sent to the SNS topic. Users must process these notifications (e.g. through a
fleet of worker hosts) and submit success/failure responses to the
CloudFormation service.

> You only need to use this type of provider if your custom resource cannot run on AWS Lambda, for reasons other than the 15
> minute timeout. If you are considering using this type of provider because you want to write a custom resource provider that may need
> to wait for more than 15 minutes for the API calls to stabilize, have a look at the [`custom-resources`](#the-custom-resource-provider-framework) module first.
>
> Refer to the [CloudFormation Custom Resource documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) for information on the contract your custom resource needs to adhere to.

Set `serviceToken` to `topic.topicArn`  in order to use this provider:

```ts
const topic = new sns.Topic(this, 'MyProvider');

new CustomResource(this, 'MyResource', {
  serviceToken: topic.topicArn
});
```

#### AWS Lambda Function

An AWS lambda function is called *directly* by CloudFormation for all resource
events. The handler must take care of explicitly submitting a success/failure
response to the CloudFormation service and handle various error cases.

> **We do not recommend you use this provider type.** The CDK has wrappers around Lambda Functions that make them easier to work with.
>
> If you do want to use this provider, refer to the [CloudFormation Custom Resource documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) for information on the contract your custom resource needs to adhere to.

Set `serviceToken` to `lambda.functionArn` to use this provider:

```ts
const fn = new lambda.SingletonFunction(this, 'MyProvider', functionProps);

new CustomResource(this, 'MyResource', {
  serviceToken: fn.functionArn,
});
```

#### The `core.CustomResourceProvider` class

The class [`@aws-cdk/core.CustomResourceProvider`] offers a basic low-level
framework designed to implement simple and slim custom resource providers. It
currently only supports Node.js-based user handlers, represents permissions as raw
JSON blobs instead of `iam.PolicyStatement` objects, and it does not have
support for asynchronous waiting (handler cannot exceed the 15min lambda
timeout). The `CustomResourceProviderRuntime` supports runtime `nodejs12.x`,
`nodejs14.x`, `nodejs16.x`, `nodejs18.x`.

[`@aws-cdk/core.CustomResourceProvider`]: https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.CustomResourceProvider.html

> **As an application builder, we do not recommend you use this provider type.** This provider exists purely for custom resources that are part of the AWS Construct Library.
>
> The [`custom-resources`](#the-custom-resource-provider-framework) provider is more convenient to work with and more fully-featured.

The provider has a built-in singleton method which uses the resource type as a
stack-unique identifier and returns the service token:

```ts
const serviceToken = CustomResourceProvider.getOrCreate(this, 'Custom::MyCustomResourceType', {
  codeDirectory: `${__dirname}/my-handler`,
  runtime: CustomResourceProviderRuntime.NODEJS_18_X,
  description: "Lambda function created by the custom resource provider",
});

new CustomResource(this, 'MyResource', {
  resourceType: 'Custom::MyCustomResourceType',
  serviceToken: serviceToken
});
```

The directory (`my-handler` in the above example) must include an `index.js` file. It cannot import
external dependencies or files outside this directory. It must export an async
function named `handler`. This function accepts the CloudFormation resource
event object and returns an object with the following structure:

```js
exports.handler = async function(event) {
  const id = event.PhysicalResourceId; // only for "Update" and "Delete"
  const props = event.ResourceProperties;
  const oldProps = event.OldResourceProperties; // only for "Update"s

  switch (event.RequestType) {
    case "Create":
      // ...

    case "Update":
      // ...

      // if an error is thrown, a FAILED response will be submitted to CFN
      throw new Error('Failed!');

    case "Delete":
      // ...
  }

  return {
    // (optional) the value resolved from `resource.ref`
    // defaults to "event.PhysicalResourceId" or "event.RequestId"
    PhysicalResourceId: "REF",

    // (optional) calling `resource.getAtt("Att1")` on the custom resource in the CDK app
    // will return the value "BAR".
    Data: {
      Att1: "BAR",
      Att2: "BAZ"
    },

    // (optional) user-visible message
    Reason: "User-visible message",

    // (optional) hides values from the console
    NoEcho: true
  };
}
```

Here is an complete example of a custom resource that summarizes two numbers:

`sum-handler/index.js`:

```js
exports.handler = async (e) => {
  return {
    Data: {
      Result: e.ResourceProperties.lhs + e.ResourceProperties.rhs,
    },
  };
};
```

`sum.ts`:

```ts nofixture
import { Construct } from 'constructs';
import {
  CustomResource,
  CustomResourceProvider,
  CustomResourceProviderRuntime,
  Token,
} from 'aws-cdk-lib';

export interface SumProps {
  readonly lhs: number;
  readonly rhs: number;
}

export class Sum extends Construct {
  public readonly result: number;

  constructor(scope: Construct, id: string, props: SumProps) {
    super(scope, id);

    const resourceType = 'Custom::Sum';
    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: `${__dirname}/sum-handler`,
      runtime: CustomResourceProviderRuntime.NODEJS_18_X,
    });

    const resource = new CustomResource(this, 'Resource', {
      resourceType: resourceType,
      serviceToken: serviceToken,
      properties: {
        lhs: props.lhs,
        rhs: props.rhs
      }
    });

    this.result = Token.asNumber(resource.getAtt('Result'));
  }
}
```

Usage will look like this:

```ts fixture=README-custom-resource-provider
const sum = new Sum(this, 'MySum', { lhs: 40, rhs: 2 });
new CfnOutput(this, 'Result', { value: Token.asString(sum.result) });
```

To access the ARN of the provider's AWS Lambda function role, use the `getOrCreateProvider()`
built-in singleton method:

```ts
const provider = CustomResourceProvider.getOrCreateProvider(this, 'Custom::MyCustomResourceType', {
  codeDirectory: `${__dirname}/my-handler`,
  runtime: CustomResourceProviderRuntime.NODEJS_18_X,
});

const roleArn = provider.roleArn;
```

This role ARN can then be used in resource-based IAM policies.

To add IAM policy statements to this role, use `addToRolePolicy()`:

```ts
const provider = CustomResourceProvider.getOrCreateProvider(this, 'Custom::MyCustomResourceType', {
  codeDirectory: `${__dirname}/my-handler`,
  runtime: CustomResourceProviderRuntime.NODEJS_18_X,
});
provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 's3:GetObject',
  Resource: '*',
})
```

Note that `addToRolePolicy()` uses direct IAM JSON policy blobs, *not* a
`iam.PolicyStatement` object like you will see in the rest of the CDK.

#### The Custom Resource Provider Framework

The [`@aws-cdk/custom-resources`] module includes an advanced framework for
implementing custom resource providers.

[`@aws-cdk/custom-resources`]: https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html

Handlers are implemented as AWS Lambda functions, which means that they can be
implemented in any Lambda-supported runtime. Furthermore, this provider has an
asynchronous mode, which means that users can provide an `isComplete` lambda
function which is called periodically until the operation is complete. This
allows implementing providers that can take up to two hours to stabilize.

Set `serviceToken` to `provider.serviceToken` to use this type of provider:

```ts
const provider = new customresources.Provider(this, 'MyProvider', {
  onEventHandler,
  isCompleteHandler, // optional async waiter
});

new CustomResource(this, 'MyResource', {
  serviceToken: provider.serviceToken
});
```

See the [documentation](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cdk-lib.custom_resources-readme.html) for more details.

## AWS CloudFormation features

A CDK stack synthesizes to an AWS CloudFormation Template. This section
explains how this module allows users to access low-level CloudFormation
features when needed.

### Stack Outputs

CloudFormation [stack outputs][cfn-stack-output] and exports are created using
the `CfnOutput` class:

```ts
new CfnOutput(this, 'OutputName', {
  value: myBucket.bucketName,
  description: 'The name of an S3 bucket', // Optional
  exportName: 'TheAwesomeBucket', // Registers a CloudFormation export named "TheAwesomeBucket"
});
```

[cfn-stack-output]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html

### Parameters

CloudFormation templates support the use of [Parameters][cfn-parameters] to
customize a template. They enable CloudFormation users to input custom values to
a template each time a stack is created or updated. While the CDK design
philosophy favors using build-time parameterization, users may need to use
CloudFormation in a number of cases (for example, when migrating an existing
stack to the AWS CDK).

Template parameters can be added to a stack by using the `CfnParameter` class:

```ts
new CfnParameter(this, 'MyParameter', {
  type: 'Number',
  default: 1337,
  // See the API reference for more configuration props
});
```

The value of parameters can then be obtained using one of the `value` methods.
As parameters are only resolved at deployment time, the values obtained are
placeholder tokens for the real value (`Token.isUnresolved()` would return `true`
for those):

```ts
const param = new CfnParameter(this, 'ParameterName', { /* config */ });

// If the parameter is a String
param.valueAsString;

// If the parameter is a Number
param.valueAsNumber;

// If the parameter is a List
param.valueAsList;
```

[cfn-parameters]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html

### Pseudo Parameters

CloudFormation supports a number of [pseudo parameters][cfn-pseudo-params],
which resolve to useful values at deployment time. CloudFormation pseudo
parameters can be obtained from static members of the `Aws` class.

It is generally recommended to access pseudo parameters from the scope's `stack`
instead, which guarantees the values produced are qualifying the designated
stack, which is essential in cases where resources are shared cross-stack:

```ts
// "this" is the current construct
const stack = Stack.of(this);

stack.account; // Returns the AWS::AccountId for this stack (or the literal value if known)
stack.region;  // Returns the AWS::Region for this stack (or the literal value if known)
stack.partition; // Returns the AWS::Partition for this stack (or the literal value if known)
```

[cfn-pseudo-params]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html

### Resource Options

CloudFormation resources can also specify [resource
attributes][cfn-resource-attributes]. The `CfnResource` class allows
accessing those through the `cfnOptions` property:

```ts
const rawBucket = new s3.CfnBucket(this, 'Bucket', { /* ... */ });
// -or-
const rawBucketAlt = myBucket.node.defaultChild as s3.CfnBucket;

// then
rawBucket.cfnOptions.condition = new CfnCondition(this, 'EnableBucket', { /* ... */ });
rawBucket.cfnOptions.metadata = {
  metadataKey: 'MetadataValue',
};
```

Resource dependencies (the `DependsOn` attribute) is modified using the
`cfnResource.addDependency` method:

```ts
const resourceA = new CfnResource(this, 'ResourceA', resourceProps);
const resourceB = new CfnResource(this, 'ResourceB', resourceProps);

resourceB.addDependency(resourceA);
```

[cfn-resource-attributes]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html

#### CreationPolicy

Some resources support a [CreationPolicy][creation-policy] to be specified as a CfnOption.

The creation policy is invoked only when AWS CloudFormation creates the associated resource. Currently, the only AWS CloudFormation resources that support creation policies are `CfnAutoScalingGroup`, `CfnInstance`, `CfnWaitCondition` and `CfnFleet`.

The `CfnFleet` resource from the `aws-appstream` module supports specifying `startFleet` as
a property of the creationPolicy on the resource options. Setting it to true will make AWS CloudFormation wait until the fleet is started before continuing with the creation of
resources that depend on the fleet resource.

```ts
const fleet = new appstream.CfnFleet(this, 'Fleet', {
  instanceType: 'stream.standard.small',
  name: 'Fleet',
  computeCapacity: {
    desiredInstances: 1,
  },
  imageName: 'AppStream-AmazonLinux2-09-21-2022',
});
fleet.cfnOptions.creationPolicy = {
  startFleet: true,
};
```

The properties passed to the level 2 constructs `AutoScalingGroup` and `Instance` from the
`aws-ec2` module abstract what is passed into the `CfnOption` properties `resourceSignal` and
`autoScalingCreationPolicy`, but when using level 1 constructs you can specify these yourself.

The CfnWaitCondition resource from the `aws-cloudformation` module suppports the `resourceSignal`.
The format of the timeout is `PT#H#M#S`. In the example below AWS Cloudformation will wait for
3 success signals to occur within 15 minutes before the status of the resource will be set to
`CREATE_COMPLETE`.

```ts
declare const resource: CfnResource;

resource.cfnOptions.creationPolicy = {
  resourceSignal: {
    count: 3,
    timeout: 'PR15M',
  }
};
```

[creation-policy]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html

### Intrinsic Functions and Condition Expressions

CloudFormation supports [intrinsic functions][cfn-intrinsics]. These functions
can be accessed from the `Fn` class, which provides type-safe methods for each
intrinsic function as well as condition expressions:

```ts
declare const myObjectOrArray: any;
declare const myArray: any;

// To use Fn::Base64
Fn.base64('SGVsbG8gQ0RLIQo=');

// To compose condition expressions:
const environmentParameter = new CfnParameter(this, 'Environment');
Fn.conditionAnd(
  // The "Environment" CloudFormation template parameter evaluates to "Production"
  Fn.conditionEquals('Production', environmentParameter),
  // The AWS::Region pseudo-parameter value is NOT equal to "us-east-1"
  Fn.conditionNot(Fn.conditionEquals('us-east-1', Aws.REGION)),
);

// To use Fn::ToJsonString
Fn.toJsonString(myObjectOrArray);

// To use Fn::Length
Fn.len(Fn.split(',', myArray));
```

When working with deploy-time values (those for which `Token.isUnresolved`
returns `true`), idiomatic conditionals from the programming language cannot be
used (the value will not be known until deployment time). When conditional logic
needs to be expressed with un-resolved values, it is necessary to use
CloudFormation conditions by means of the `CfnCondition` class:

```ts
const environmentParameter = new CfnParameter(this, 'Environment');
const isProd = new CfnCondition(this, 'IsProduction', {
  expression: Fn.conditionEquals('Production', environmentParameter),
});

// Configuration value that is a different string based on IsProduction
const stage = Fn.conditionIf(isProd.logicalId, 'Beta', 'Prod').toString();

// Make Bucket creation condition to IsProduction by accessing
// and overriding the CloudFormation resource
const bucket = new s3.Bucket(this, 'Bucket');
const cfnBucket = myBucket.node.defaultChild as s3.CfnBucket;
cfnBucket.cfnOptions.condition = isProd;
```

[cfn-intrinsics]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html

### Mappings

CloudFormation [mappings][cfn-mappings] are created and queried using the
`CfnMappings` class:

```ts
const regionTable = new CfnMapping(this, 'RegionTable', {
  mapping: {
    'us-east-1': {
      regionName: 'US East (N. Virginia)',
      // ...
    },
    'us-east-2': {
      regionName: 'US East (Ohio)',
      // ...
    },
    // ...
  }
});

regionTable.findInMap(Aws.REGION, 'regionName')
```

This will yield the following template:

```yaml
Mappings:
  RegionTable:
    us-east-1:
      regionName: US East (N. Virginia)
    us-east-2:
      regionName: US East (Ohio)
```

Mappings can also be synthesized "lazily"; lazy mappings will only render a "Mappings"
section in the synthesized CloudFormation template if some `findInMap` call is unable to
immediately return a concrete value due to one or both of the keys being unresolved tokens
(some value only available at deploy-time).

For example, the following code will not produce anything in the "Mappings" section. The
call to `findInMap` will be able to resolve the value during synthesis and simply return
`'US East (Ohio)'`.

```ts
const regionTable = new CfnMapping(this, 'RegionTable', {
  mapping: {
    'us-east-1': {
      regionName: 'US East (N. Virginia)',
    },
    'us-east-2': {
      regionName: 'US East (Ohio)',
    },
  },
  lazy: true,
});

regionTable.findInMap('us-east-2', 'regionName');
```

On the other hand, the following code will produce the "Mappings" section shown above,
since the top-level key is an unresolved token. The call to `findInMap` will return a token that resolves to
`{ "Fn::FindInMap": [ "RegionTable", { "Ref": "AWS::Region" }, "regionName" ] }`.

```ts
declare const regionTable: CfnMapping;

regionTable.findInMap(Aws.REGION, 'regionName');
```

An optional default value can also be passed to `findInMap`. If either key is not found in the map and the mapping is lazy, `findInMap` will return the default value and not render the mapping.
If the mapping is not lazy or either key is an unresolved token, the call to `findInMap` will return a token that resolves to 
`{ "Fn::FindInMap": [ "MapName", "TopLevelKey", "SecondLevelKey", { "DefaultValue": "DefaultValue" } ] }`, and the mapping will be rendered.
Note that the `AWS::LanguageExtentions` transform is added to enable the default value functionality.

For example, the following code will again not produce anything in the "Mappings" section. The
call to `findInMap` will be able to resolve the value during synthesis and simply return
`'Region not found'`.

```ts
const regionTable = new CfnMapping(this, 'RegionTable', {
  mapping: {
    'us-east-1': {
      regionName: 'US East (N. Virginia)',
    },
    'us-east-2': {
      regionName: 'US East (Ohio)',
    },
  },
  lazy: true,
});

regionTable.findInMap('us-west-1', 'regionName', 'Region not found');
```

[cfn-mappings]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html

### Dynamic References

CloudFormation supports [dynamically resolving][cfn-dynamic-references] values
for SSM parameters (including secure strings) and Secrets Manager. Encoding such
references is done using the `CfnDynamicReference` class:

```ts
new CfnDynamicReference(
  CfnDynamicReferenceService.SECRETS_MANAGER,
  'secret-id:secret-string:json-key:version-stage:version-id',
);
```

[cfn-dynamic-references]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html

### Template Options & Transform

CloudFormation templates support a number of options, including which Macros or
[Transforms][cfn-transform] to use when deploying the stack. Those can be
configured using the `stack.templateOptions` property:

```ts
const stack = new Stack(app, 'StackName');

stack.templateOptions.description = 'This will appear in the AWS console';
stack.templateOptions.transforms = ['AWS::Serverless-2016-10-31'];
stack.templateOptions.metadata = {
  metadataKey: 'MetadataValue',
};
```

[cfn-transform]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html

### Emitting Raw Resources

The `CfnResource` class allows emitting arbitrary entries in the
[Resources][cfn-resources] section of the CloudFormation template.

```ts
new CfnResource(this, 'ResourceId', {
  type: 'AWS::S3::Bucket',
  properties: {
    BucketName: 'bucket-name'
  },
});
```

As for any other resource, the logical ID in the CloudFormation template will be
generated by the AWS CDK, but the type and properties will be copied verbatim in
the synthesized template.

[cfn-resources]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html

### Including raw CloudFormation template fragments

When migrating a CloudFormation stack to the AWS CDK, it can be useful to
include fragments of an existing template verbatim in the synthesized template.
This can be achieved using the `CfnInclude` class.

```ts
new CfnInclude(this, 'ID', {
  template: {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'my-shiny-bucket'
        }
      }
    }
  },
});
```

### Termination Protection

You can prevent a stack from being accidentally deleted by enabling termination
protection on the stack. If a user attempts to delete a stack with termination
protection enabled, the deletion fails and the stack--including its status--remains
unchanged. Enabling or disabling termination protection on a stack sets it for any
nested stacks belonging to that stack as well. You can enable termination protection
on a stack by setting the `terminationProtection` prop to `true`.

```ts
const stack = new Stack(app, 'StackName', {
  terminationProtection: true,
});
```

You can also set termination protection with the setter after you've instantiated the stack.

```ts
const stack = new Stack(app, 'StackName', {});
stack.terminationProtection = true;
```

By default, termination protection is disabled.

### Description

You can add a description of the stack in the same way as `StackProps`.

```ts
const stack = new Stack(app, 'StackName', {
  description: 'This is a description.',
});
```

### CfnJson

`CfnJson` allows you to postpone the resolution of a JSON blob from
deployment-time. This is useful in cases where the CloudFormation JSON template
cannot express a certain value.

A common example is to use `CfnJson` in order to render a JSON map which needs
to use intrinsic functions in keys. Since JSON map keys must be strings, it is
impossible to use intrinsics in keys and `CfnJson` can help.

The following example defines an IAM role which can only be assumed by
principals that are tagged with a specific tag.

```ts
const tagParam = new CfnParameter(this, 'TagName');

const stringEquals = new CfnJson(this, 'ConditionJson', {
  value: {
    [`aws:PrincipalTag/${tagParam.valueAsString}`]: true,
  },
});

const principal = new iam.AccountRootPrincipal().withConditions({
  StringEquals: stringEquals,
});

new iam.Role(this, 'MyRole', { assumedBy: principal });
```

**Explanation**: since in this example we pass the tag name through a parameter, it
can only be resolved during deployment. The resolved value can be represented in
the template through a `{ "Ref": "TagName" }`. However, since we want to use
this value inside a [`aws:PrincipalTag/TAG-NAME`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principaltag)
IAM operator, we need it in the *key* of a `StringEquals` condition. JSON keys
*must be* strings, so to circumvent this limitation, we use `CfnJson`
to "delay" the rendition of this template section to deploy-time. This means
that the value of `StringEquals` in the template will be `{ "Fn::GetAtt": [ "ConditionJson", "Value" ] }`, and will only "expand" to the operator we synthesized during deployment.

### Stack Resource Limit

When deploying to AWS CloudFormation, it needs to keep in check the amount of resources being added inside a Stack. Currently it's possible to check the limits in the [AWS CloudFormation quotas](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html) page.

It's possible to synthesize the project with more Resources than the allowed (or even reduce the number of Resources).

Set the context key `@aws-cdk/core:stackResourceLimit` with the proper value, being 0 for disable the limit of resources.

### Template Indentation

The AWS CloudFormation templates generated by CDK include indentation by default. 
Indentation makes the templates more readable, but also increases their size, 
and CloudFormation templates cannot exceed 1MB.

It's possible to reduce the size of your templates by suppressing indentation.

To do this for all templates, set the context key `@aws-cdk/core:suppressTemplateIndentation` to `true`.

To do this for a specific stack, add a `suppressTemplateIndentation: true` property to the 
stack's `StackProps` parameter. You can also set this property to `false` to override 
the context key setting.

## App Context

[Context values](https://docs.aws.amazon.com/cdk/v2/guide/context.html) are key-value pairs that can be associated with an app, stack, or construct.
One common use case for context is to use it for enabling/disabling [feature flags](https://docs.aws.amazon.com/cdk/v2/guide/featureflags.html). There are several places
where context can be specified. They are listed below in the order they are evaluated (items at the
top take precedence over those below).

- The `node.setContext()` method
- The `postCliContext` prop when you create an `App`
- The CLI via the `--context` CLI argument
- The `cdk.json` file via the `context` key:
- The `cdk.context.json` file:
- The `~/.cdk.json` file via the `context` key:
- The `context` prop when you create an `App`

### Examples of setting context

```ts
new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },
});
```

```ts
const app = new App();
app.node.setContext('@aws-cdk/core:newStyleStackSynthesis', true);
```

```ts
new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },
});
```

```console
cdk synth --context @aws-cdk/core:newStyleStackSynthesis=true
```

_cdk.json_

```json
{
  "context": {
    "@aws-cdk/core:newStyleStackSynthesis": true
  }
}
```

_cdk.context.json_

```json
{
  "@aws-cdk/core:newStyleStackSynthesis": true
}
```

_~/.cdk.json_

```json
{
  "context": {
    "@aws-cdk/core:newStyleStackSynthesis": true
  }
}
```

## IAM Permissions Boundary

It is possible to apply an [IAM permissions boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)
to all roles within a specific construct scope. The most common use case would
be to apply a permissions boundary at the `Stage` level.

```ts
const prodStage = new Stage(app, 'ProdStage', {
  permissionsBoundary: PermissionsBoundary.fromName('cdk-${Qualifier}-PermissionsBoundary'),
});
```

Any IAM Roles or Users created within this Stage will have the default
permissions boundary attached.

For more details see the [Permissions Boundary](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html#permissions-boundaries) section in the IAM guide.

## Policy Validation

If you or your organization use (or would like to use) any policy validation tool, such as
[CloudFormation
Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) or
[OPA](https://www.openpolicyagent.org/), to define constraints on your
CloudFormation template, you can incorporate them into the CDK application.
By using the appropriate plugin, you can make the CDK application check the
generated CloudFormation templates against your policies immediately after
synthesis. If there are any violations, the synthesis will fail and a report
will be printed to the console or to a file (see below).

> **Note**
> This feature is considered experimental, and both the plugin API and the
> format of the validation report are subject to change in the future.

### For application developers

To use one or more validation plugins in your application, use the
`policyValidationBeta1` property of `Stage`:

```ts fixture=validation-plugin
// globally for the entire app (an app is a stage)
const app = new App({
  policyValidationBeta1: [
    // These hypothetical classes implement IPolicyValidationPluginBeta1:
    new ThirdPartyPluginX(),
    new ThirdPartyPluginY(),
  ],
});

// only apply to a particular stage
const prodStage = new Stage(app, 'ProdStage', {
  policyValidationBeta1: [
    new ThirdPartyPluginX(),
  ],
});
```

Immediately after synthesis, all plugins registered this way will be invoked to
validate all the templates generated in the scope you defined. In particular, if
you register the templates in the `App` object, all templates will be subject to
validation.

> **Warning**
> Other than modifying the cloud assembly, plugins can do anything that your CDK
> application can. They can read data from the filesystem, access the network
> etc. It's your responsibility as the consumer of a plugin to verify that it is
> secure to use.

By default, the report will be printed in a human readable format. If you want a
report in JSON format, enable it using the `@aws-cdk/core:validationReportJson`
context passing it directly to the application:

```ts
const app = new App({
  context: { '@aws-cdk/core:validationReportJson': true },
});
```

Alternatively, you can set this context key-value pair using the `cdk.json` or
`cdk.context.json` files in your project directory (see
[Runtime context](https://docs.aws.amazon.com/cdk/v2/guide/context.html)).

If you choose the JSON format, the CDK will print the policy validation report
to a file called `policy-validation-report.json` in the cloud assembly
directory. For the default, human-readable format, the report will be printed to
the standard output.

### For plugin authors

The communication protocol between the CDK core module and your policy tool is
defined by the `IPolicyValidationPluginBeta1` interface. To create a new plugin you must
write a class that implements this interface. There are two things you need to
implement: the plugin name (by overriding the `name` property), and the
`validate()` method.

The framework will call `validate()`, passing an `IPolicyValidationContextBeta1` object.
The location of the templates to be validated is given by `templatePaths`. The
plugin should return an instance of `PolicyValidationPluginReportBeta1`. This object
represents the report that the user wil receive at the end of the synthesis.

```ts fixture=validation-plugin
class MyPlugin implements IPolicyValidationPluginBeta1 {
  public readonly name = 'MyPlugin';

  public validate(context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
    // First read the templates using context.templatePaths...

    // ...then perform the validation, and then compose and return the report.
    // Using hard-coded values here for better clarity:
    return {
      success: false,
      violations: [{
        ruleName: 'CKV_AWS_117',
        description: 'Ensure that AWS Lambda function is configured inside a VPC',
        fix: 'https://docs.bridgecrew.io/docs/ensure-that-aws-lambda-function-is-configured-inside-a-vpc-1',
        violatingResources: [{
          resourceLogicalId: 'MyFunction3BAA72D1',
          templatePath: '/home/johndoe/myapp/cdk.out/MyService.template.json',
          locations: ['Properties/VpcConfig'],
        }],
      }],
    };
  }
}
```

In addition to the name, plugins may optionally report their version (`version`
property ) and a list of IDs of the rules they are going to evaluate (`ruleIds`
property).

Note that plugins are not allowed to modify anything in the cloud assembly. Any
attempt to do so will result in synthesis failure.

If your plugin depends on an external tool, keep in mind that some developers may
not have that tool installed in their workstations yet. To minimize friction, we
highly recommend that you provide some installation script along with your
plugin package, to automate the whole process. Better yet, run that script as
part of the installation of your package. With `npm`, for example, you can run
add it to the `postinstall`
[script](https://docs.npmjs.com/cli/v9/using-npm/scripts) in the `package.json`
file.

## Annotations

Construct authors can add annotations to constructs to report at three different
levels: `ERROR`, `WARN`, `INFO`.

Typically warnings are added for things that are important for the user to be
aware of, but will not cause deployment errors in all cases. Some common
scenarios are (non-exhaustive list):

- Warn when the user needs to take a manual action, e.g. IAM policy should be
  added to an referenced resource.
- Warn if the user configuration might not follow best practices (but is still
  valid)
- Warn if the user is using a deprecated API

### Acknowledging Warnings

If you would like to run with `--strict` mode enabled (warnings will throw
errors) it is possible to `acknowledge` warnings to make the warning go away.

For example, if > 10 IAM managed policies are added to an IAM Group, a warning
will be created:

```text
IAM:Group:MaxPoliciesExceeded: You added 11 to IAM Group my-group. The maximum number of managed policies attached to an IAM group is 10.
```

If you have requested a [quota increase](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities)
you may have the ability to add > 10 managed policies which means that this
warning does not apply to you. You can acknowledge this by `acknowledging` the
warning by the `id`.

```ts
Annotations.of(this).acknowledgeWarning('IAM:Group:MaxPoliciesExceeded', 'Account has quota increased to 20');
```

<!--END CORE DOCUMENTATION-->
