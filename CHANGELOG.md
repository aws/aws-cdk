## [UNRELEASED]

 * CloudWatch: add `Metric.grantPutMetricData()` to give `PutMetricData` permissions to IAM
   identities. ([#258])
* [FIXED] `cdk docs` works but a message __Unknown command: docs__ is printed ([#256])
* Lambda (feature): add `role` parameter, making it possible to specify an
  externally defined execution role.

[#258]: https://github.com/awslabs/aws-cdk/pull/258

## 0.7.3 - 2018-07-09

### Highlights

 * Introducing Java support (see the __Getting Started__ documentation topic for
   instructions on how to set up a Java project).
 * Introduce a new programming model for CloudWatch metrics, alarms and
   dashboards (see the [@aws-cdk/cloudwatch documentation]).
 * Multiple documentation improvements (open with `cdk docs`).

[@aws-cdk/cloudwatch documentation]: https://github.com/awslabs/aws-cdk/blob/master/packages/%40aws-cdk/cloudwatch/README.md

### Known Issues

 * Missing instructions for Windows Setup ([#138])
 * `cdk docs` works but a message __Unknown command: docs__ is printed ([#256])
 * Java: passing `null` behaves differently than no arguments. Workaround is to
   build an empty object ([#157])

### Changes

 * Introduce Java support ([@eladb] in [#229], [#245], [#148], [#149])
 * Changed the way the beta archive is structured to no longer bundle a
   pre-installed `node_modules` directory but rather only a local npm
   repository. This changes the setup instructions to require `y-npm i -g
   aws-cdk` to install the toolkit on the system, which is more inline with the
   setup experience post-beta  ([@RomainMuller] in [#161], [#162] and
   [awslabs/jsii#43]).
 * CloudWatch (new): introduce a rich programming model for metrics, alarms and
   dashboards ([@rix0rrr] in [#180], [#194])
 * S3 (feature): add support for SSE-S3 encryption ([@rix0rrr] in [#257])
 * Lambda (feature): add support for node.js 8.10 runtime ([@RomainMuller] in
   [#187])
 * Runtime Values (fix): use allowed characters in SSM parameter name when
   advertising a runtime value ([@eladb] in [#208])
 * SNS (docs): convert examples in README into compiled code ([@rix0rrr] in
   [#107])
 * Toolkit (feature): introduce `cdk doctor` to collect information for
   diagnostics ([@RomainMuller] in [#177])
 * Toolkit (feature): align AWS credentials behavior to AWS CLI ([@RomainMuller]
   in [#175])
 * Toolkit (performance): cache default AWS account ID on disk ([@eladb] in
   [#220])
 * Docs: multiple updates ([@Doug-AWS] in [#142])
 * Docs: improve topic on logical IDs ([@eladb] in [#209])
 * Docs: add support for code snippets in multiple tabs ([@eladb] in [#231])
 * Docs: rewrote the "Getting Started" documentation topic to include
   step-by-step project setup details instead of using `cdk-init`. This is in
   order to improve understanding of how the CDK works when users get started
   ([@eladb] in [#245])
 * Resource bundler: generate `.d.ts` ([@rix0rrr] in [#172])

[#157]: https://github.com/awslabs/aws-cdk/pull/157
[#256]: https://github.com/awslabs/aws-cdk/pull/256
[#194]: https://github.com/awslabs/aws-cdk/pull/194
[#180]: https://github.com/awslabs/aws-cdk/pull/180
[#107]: https://github.com/awslabs/aws-cdk/pull/107
[#175]: https://github.com/awslabs/aws-cdk/pull/175
[#172]: https://github.com/awslabs/aws-cdk/pull/172
[#142]: https://github.com/awslabs/aws-cdk/pull/142
[#149]: https://github.com/awslabs/aws-cdk/pull/149
[#148]: https://github.com/awslabs/aws-cdk/pull/148
[#177]: https://github.com/awslabs/aws-cdk/pull/177
[#257]: https://github.com/awslabs/aws-cdk/pull/257
[#187]: https://github.com/awslabs/aws-cdk/pull/187
[#209]: https://github.com/awslabs/aws-cdk/pull/209
[#208]: https://github.com/awslabs/aws-cdk/pull/208
[#229]: https://github.com/awslabs/aws-cdk/pull/229
[#231]: https://github.com/awslabs/aws-cdk/pull/231
[#220]: https://github.com/awslabs/aws-cdk/pull/220
[#161]: https://github.com/awslabs/aws-cdk/pull/161
[#162]: https://github.com/awslabs/aws-cdk/pull/162
[#245]: https://github.com/awslabs/aws-cdk/pull/245
[awslabs/jsii#43]: https://github.com/awslabs/jsii/pull/43

[@rix0rrr]: https://github.com/rix0rrr

## 0.7.2 - 2018-06-19

 * Add: initial construct library for [AWS Kinesis Data Streams] ([@sam-goodwin] in [#86])
 * Update low-level resources from [CloudFormation resource specification]
 * Update dependencies ([@eladb] in [#119])
 * Fix: Adopt SDK-standard behavior when no environment is specified ([@RomainMuller] in [#128])
 * Fix: Have cdk diff output render 'number' value changes ([@RomainMuller] in [#136])

### Known issues

 * Windows setup has not been vetted and might be broken - __no workaround__
   ([#138])
 * If region is not defined, error message is unclear - __workaround__: make sure
   to define `region` when running `aws configure` ([#131])
 * `cdk docs` opens the index instead of the welcome page - __workaround__:
   click on "Welcome" in the sidebar ([#129])
 * The runtime values library (__@aws-cdk/rtv__) is broken ([#151])

[CloudFormation resource specification]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
[AWS Kinesis Data Streams]: https://aws.amazon.com/kinesis/data-streams

[@sam-goodwin]:  https://github.com/sam-goodwin
[@RomainMuller]: https://github.com/RomainMuller
[@eladb]:        https://github.com/eladb

[#86]:  https://github.com/awslabs/aws-cdk/pull/86
[#128]: https://github.com/awslabs/aws-cdk/pull/128
[#136]: https://github.com/awslabs/aws-cdk/pull/136
[#119]: https://github.com/awslabs/aws-cdk/pull/119
[#131]: https://github.com/awslabs/aws-cdk/pull/131
[#138]: https://github.com/awslabs/aws-cdk/pull/138
[#129]: https://github.com/awslabs/aws-cdk/pull/129
[#151]: https://github.com/awslabs/aws-cdk/issues/151

## 0.7.1 - 2018-06-15

### Framework

 * Two-way IAM policy statement additions have been removed for S3 and SNS,
   because those services treat resource and identity policies as additive.
   KMS grants are still added on both resource and identity because KMS
   requires permissions set from both sides.

### Toolkit

 * `cdk init` interface changed to accept the template name as a positional
   argument, and the language as an option. A `--list` option was added to
   allow listing available templates.
 * `cdk-beta-npm` is a wrapper to `npm` that executes commands with a local registry
   that has the CDK packages available. It should be used instead of `npm` for
   subcommands such as `npm install`.
 * CDK now respects `AWS_DEFAULT_REGION` environment variable if set.

## 0.7.0 - 2018-06-13

### Framework

 * _BREAKING_: All CDK packages are non under the scope `@aws-cdk` (e.g.
   `@aws-cdk/s3`).
 * _BREAKING_: The `jsii` compiler now configures `tsconfig.json` to produce definition
   files (files with a .d.ts extension). This requires updating your existing
   `package.json` files `types` key to replace the .ts extension with a .d.ts
   extension.
 * Java bindings now include static methods and constants.
 * `SecretParameter` can be used to load values from the SSM parameter store
   during deployment and use them as `Secret`s.
 * `Stack` is locked for mutations during synthesis to protect against
   accidental changes in lazy values.
 * An overhaul of documentation updates, edits and improvements.

### ACM

 * Fix: `cloudFrontDefaultCertificate` is mutually exclusive with `acmCertificateArn`.

### CloudFront (new)

 * Added a new construct library for AWS CloudFront.

### CodeBuild

 * Added support for specifying environment variables at the container and
   project levels.

### CodePipeline

 * Fix: GitHub action "owner" changed to `ThirdParty`.
 * Removed all fluent APIs
 * Use "master" as the default branch for Source actions
 * _BREAKING_: `AmazonS3SourceProps` - renamed `key` to `bucketKey`

### Custom Resources

 * _BREAKING_: Require that Lambda is referenced explicitly when defining a custom resource.
   `SingletonLambda` can be used to encapsulate the custom resource's lambda
   function but only have a single instance of it in the stack.

### Events (new)

A new cross-stack programming model is introduced to support CloudWatch Events.
Event sources implement `onXxx` methods for various events that can emitted by
that source and event targets implement `IEventRuleTarget`, so they can be
polymorphically added to rules.

```ts
const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });
const project = new BuildProject(stack, 'MyProject', { source: new CodeCommitSource(repo) });

const topic = new Topic(stack, 'MyTopic');
topic.subscribeEmail('Personal', 'myteam@mycompany.com');

project.onStateChange(topic);
```

Coverage to all event sources and target will be added in subsequent releases.

Supported targets:

 * `codebuild.BuildProject`
 * `codepipline.Pipeline`
 * `sns.Topic`

Supported sources:

 * __CodeBuild__: `onStateChange`, `onPhaseChange`, `onBuildStarted`, `onBuildFailed`, `onBuildSucceeded`.
 * __CodeCommit__: `onEvent`, `onStateChange`, `onReferenceCreated`, `onReferenceUpdated`, `onReferenceDeleted`, `onPullRequestStateChange`, `onCommentOnPullRequest`, `onCommentOnCommit`, `onCommit`.
 * __CodePipeline__: `pipeline.onStateChange`, `stage.onStateChange`, `action.onStateChange`.

### IAM

 * Add `CanonicalUserPrincipal`
 * Add `statementCount` to `PolicyDocumennt`.
 * Extended support for `FederatedPrincipal`.

### Lambda

 * Add `initialPolicy` prop which allows specifying a set of `PolicyStatement`s
   upon definition.

### S3

* Added support for lifecycle rules
* Add `domainName` and `dualstackDomainName` attributes

### Serverless

 * `version` field of `FunctionResource` is now optional.

### SNS

 * _BREAKING_: `subscribeXxx` APIs now do not require a name when possible
   (for queue, Lambda).
 * Unique SID assigned to resource policy statements.

### Toolkit

 * `cdk docs` opens your browser with the bundled documentation content.
 * `cdk init` interface changed to specify `--lang` and `--type` separately.
 * Plug-in architecture improved.

## 0.6.0 - 2018-05-16

### AWS Construct Libraries

The main theme for this release is the stabilization of our framework APIs and
an initial set of __AWS Construct Libraries__.

Previously, CDK users would normally to program against the `@aws-cdk/resources`
library which included generated classes for all CloudFormation resources. For
example, the `sqs.QueueResource` defined the __AWS::SQS::Queue__ CloudFormation
resource.

Starting in 0.6, we recommend that users define their infrastructure using a new
set of _hand-crafted libraries_ we refer to as __AWS Construct Libraries__ (we
used to call these "Layer 2" or "L2"). These libraries include CDK constructs
with rich and powerful object-oriented APIs for defining infrastructure.

For example:

```ts
const vpc = new VpcNetwork(this, 'MyVpc');

const fleet = new Fleet(this, 'MyFleet', {
    vpc, instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.XLarge),
    machineImage: new AmazonLinuxImage()
});

const clb = new ClassicLoadBalancer(this, 'LB', {
    vpc, internetFacing: true
});

clb.addListener({ externalPort: 80 });
clb.addTarget(fleet);
```

Synthesizing this stack to the us-east-1 region (which has 6 availability zones)
will result in a CloudFormation template that contains 72 resources of 17
different resource types.

### Construct initializers now include a name

All constructs in a CDK stack must have a name unique amongst its siblings.
Names are used to allocate stack-wide logical IDs for each CloudFormation
resource. Prior to this release, the name of the class was implicitly used as a
default name for the construct. As much as this was convenient, we realized it
was misleading and potentially unsafe, since a change in a class name will
result in changes to all logical IDs for all resources created within that tree,
and changes to logical IDs result in __resource replacement__ since
CloudFormation cannot associate the existing resource with the new resource
(this is the purpose of logical IDs in CloudFormation).

Therefore, we decided construct names deserve an explicit and prominent place in
our programming model and starting from this release, they have been promoted to
the 2nd argument of all initializers.

```ts
new MyConstruct(parent, name, props);
```

### New scheme for allocating CloudFormation logical IDs

In order to ensure uniqueness of logical IDs within a stack, we need to reflect
the resource's full CDK path within it's logical ID. Prior to this release,
logical IDs were a simple concatenation of the path components leading up to the
resource. However, this could potentially create unresolvable conflicts ("a/b/c"
== "ab/c").

Since logical IDs may only use alphanumeric characters and also restricted in
length, we are unable to simply use a delimited path as the logical ID. Instead
IDs are allocated by concatenating a human-friendly rendition from the path
(components, de-duplicate, trim) with a short MD5 hash of the delimited path:

```
VPCPrivateSubnet2RouteTable0A19E10E
<-----------human---------><-hash->
```

One exception to this scheme is resources which are direct children of the
`Stack`. Such resources will use their name as a logical ID (without the hash).
This is done to support easier migration from existing CloudFormation templates.

### Renaming logical IDs to avoid destruction of resources

If you have CDK stacks deployed with persistent resources such as S3 buckets or
DynamoDB tables, you may want to explicitly "rename" the new logical IDs to
match your existing resources.

First, make sure you compare the newly synthesized template with any deployed
stacks. `cdk diff` will tell you which resources will be destroyed if you deploy
this update:

```
[-] Destroying MyTable (type: AWS::DynamoDB::Table)
[+] Creating MyTableCD117FA1 (type: AWS::DynamoDB::Table)
```

In order to avoid this, you can use `stack.renameLogical(from, to)` as follows.
Note that `renameLogical` must be called __before__ the resource is defined as
logical IDs are allocated during initialization:

```ts
// must be before defining the table (this instanceof Stack)
this.renameLogical('MyTableCD117FA1', 'MyTable');
new dynamodb.Table(this, 'MyTable', { /* .. */ });
```

Now, `cdk diff` should indicate no differences.

### All "props" types are now interfaces instead of classes

In order to improve the developer experience, we have changed the way we model
construct "Props" and now they are defined as TypeScript interfaces. This has a
few implications on how to use them:

In TypeScript, `new XxxProps()` won't work, you will have to simply assign an
object literal:

```ts
new Queue(this, 'MyQueue', { visibilityTimeoutSec: 300 });
```

In Java, you can create a concrete object using a builder:

```java
new Queue(this, "MyQueue", QueueProps.builder()
    .withVisibilityTimeout(300)
    .build());
```

### A design pattern for exporting/importing resources

All AWS constructs implement a common pattern which allows treating resources
defined within the current stack and existing resources to be treated via a
common interface:

For example, when defining a `Pipeline`, you can supply an artifacts bucket.

The bucket is defined within the same stack:

```ts
const bucket = new Bucket(this, 'MyArtifactsBucket');
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: bucket });
```

You can also import a bucket by just specifying its name:

```ts
const bucket = Bucket.import({ bucketName: new BucketName('my-bucket') });
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: bucket });
```

Or you can export the bucket from another stack and import it:

```ts
// some other stack:
const bucket = new Bucket(otherStack, 'MyBucket');
const externalBucket = bucket.export();
// bucketRef contains tokens that allow you to pass it into `import`.

// my stack:
const importedBucket = Bucket.import(this, 'OtherArtifactsBucket', externalBucket);
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: importedBucket });
```

### Region-aware APIs for working with machine images (AMIs)

The __@aws-cdk/ec2__ library exposes a new API for region-aware AMI discovery:

```ts
const ami = new AmazonLinuxImage({
    edition: AmazonLinuxEdition.Standard, // default
    virtualization: AmazonLinuxVirt.HVM,  // default
    storage: AmazonLinuxStorage.EBS       // default is GeneralPurpose
});

new Fleet(this, 'MyAmazonLinuxFleet', { machineImage: ami, ... });
```

For Windows:

```ts
const ami = new WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase);
new Fleet(this, 'MyWindowsFleet', { machineImage: ami, ... });
```

Or, a mapping utility:

```ts
const ami = new GenericLinuxImage({
    'us-east-1': 'ami-62bda218',
    'eu-west-1': 'ami-773acbcc'
});

new Fleet(this, 'MySuseFleet', { machineImage: ami, ... });
```

### A rich programming model for Code Suite services

The __@aws-cdk/codebuild__, __@aws-cdk/codecommit__ and __@aws-cdk/codepipeline__
construct libraries include rich APIs for defining continuous integration
pipelines and builds.

The following code defines a pipeline with a CodeCommit source and CodeBuild
build step. The pipeline is created with an artifacts bucket and a role, and
least-privilege policy documents are automatically generated.

```ts
// define a CodeCommit repository
const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

// define a pipeline with two stages ("source" and "build")
const pipeline  = new Pipeline(stack, 'Pipeline');
const sourceStage = new Stage(pipeline, 'source');
const buildStage  = new Stage(pipeline, 'build');

// associate the source stage with the code commit repository
const source = new CodeCommitSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

// associate the build stage with code build project
new CodeBuildAction(buildStage, 'build', {
    project: new BuildProject(stack, 'MyBuildProject', { source: new CodePipelineSource() },
    source
});
```

### Inline JavaScript Lambda Functions

The __@aws-cdk/lambda__ library includes an `InlineJavaScriptLambda` construct
which makes it very easy to implement simple node.js Lambda functions with code
inline in the CDK.

This CDK program defines an S3 Bucket and a Lambda function, and sets all the
needed permissions. When the function is invoked, a file named 'myfile.txt' will
be uploaded to the bucket with the text "Hello, world". The physical bucket name
is passed through via the `BUCKET_NAME` environment variable.

```ts
const bucket = new Bucket(this, 'MyBucket');

const lambda = new InlineJavaScriptLambda(this, 'MyLambda', {
    environment: {
        BUCKET_NAME: bucket.bucketName
    },
    handler: {
        fn: (event: any, context: any, callback: any) => {
            const s3 = new require('aws-sdk').S3();

            const req = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'myfile.txt',
                Body: 'Hello, world'
            };

            return s3.upload(req, (err, data) => {
                if (err) return callback(err);
                console.log(data);
                return callback();
            });
        }
    }
});

// grant the Lambda execution role read/write permissions for the bucket
// this also adds a corresponding bucket resource policy
bucket.grantReadWrite(lambda.role);
```

### Resource and role IAM policies and grants

All AWS constructs now expose APIs for naturally adding statements to their
resource or role policies. Constructs may have `addToRolePolicy(statement)` or
`addToResourcePolicy(statement)` methods, which can be used to mutate the
policies associated with a resource.

The `statement` is a `PolicyStatement` object with a rich API for producing IAM
statements. This is an excerpt from the implementation of
`topic.subscribeQueue`:

```ts
queue.addToResourcePolicy(new PolicyStatement()
    .addResource(queue.queueArn)
    .addAction('sqs:SendMessage')
    .addServicePrincipal('sns.amazonaws.com')
    .setCondition('ArnEquals', { 'aws:SourceArn': this.topicArn }));
```

The S3 bucket construct has a set of "grant" methods (`grantRead`,
`grantReadWrite`) which accept a principal resource (user, role or group) and an
optional key prefix pattern and will render reciprocal IAM permissions, both in
the principal's policy and the bucket policy:

```ts
const reader = new User(this, 'Reader');
const bucket = new Bucket(this, 'MyBucket');
bucket.grantRead(reader);
```

Synthesizes to:

```yaml
Resources:
  ReaderF7BF189D:
    Type: AWS::IAM::User
  ReaderDefaultPolicy151F3818:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
        - Action: [ "s3:GetObject*", "s3:GetBucket*", "s3:List*" ]
          Effect: Allow
          Resource:
          - { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }
          - { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }, "/", "*" ] ] }
        Version: '2012-10-17'
      PolicyName: ReaderDefaultPolicy151F3818
      Users: [ { "Ref": "ReaderF7BF189D" } ]
  MyBucketF68F3FF0:
    Type: AWS::S3::Bucket
  MyBucketPolicyE7FBAC7B:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: { "Ref": "MyBucketF68F3FF0" }
      PolicyDocument:
        Statement:
        - Action: [ "s3:GetObject*", "s3:GetBucket*", "s3:List*" ]
          Effect: Allow
          Principal:
            AWS: { "Fn::GetAtt": [ "ReaderF7BF189D", "Arn" ] }
          Resource:
          - { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }]
          - { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }, "/", "*" ] ] }
        Version: '2012-10-17'
```

### Security group connections framework

The __@aws-cdk/ec2__ library includes a rich framework for modeling security
group connections between resources such as a fleet, load balancers and
databases.

For example, these automatically create appropriate ingress and egress rules in
both security groups:

```ts
// allow fleet1 top connect to fleet2 on port 80
fleet1.connections.allowTo(fleet2, new TcpPort(80), 'Allow between fleets');

// allow fleet3 to accept connections from a load balancer on ports 60000-65535
fleet3.connections.allowFrom(loadBalancer, new TcpPortRange(60000, 65535), 'Allow from load balancer');
```

### Improvements to attribute classes and tokens

 * Remove the "Attribute" postfix from all generated attribute types. So now, it
   is `QueueArn` instead of `QueueArnAttribute`. "Attribute" postfix from
   attribute types
 * Simplify the initialization of `Token` objects (all attribute types are
   Tokens). They can now be either initialized with a simple value or a lazy
   function. This means, that now you can write `new QueueArn('foo')`. This is
   useful when importing external resources into the stack.

### Improvements to the CDK Toolkit

The toolkit now outputs YAML instead of JSON by default.

Added active progress reporting for stack updates.

The diff output has been dramatically improved and provides a structure-aware
diff. For example:

```
[~] Updating TableCD117FA1 (type: AWS::DynamoDB::Table)
        .ProvisionedThroughput:
            .WriteCapacityUnits: 10
    Creating MyQueueE6CA6235 (type: AWS::SQS::Queue)
```

### Library for unit and integration testing

The CDK is now shipped with a library called __@aws-cdk/assert__ which aims to
make it easy to write unit and integration tests for CDK libraries and apps. The
library leverages the same powerful template diff mechanism used in the toolkit
to print rich descriptions.

```ts
import { expect } from '@aws-cdk/assert';

const stack = new Stack();
new Queue(stack, 'MyQueue', { visibilityTimeout: 300 });

expect(stack).to(haveResource('AWS::SQS::Queue', { VisibilityTimeout: 300 }));
expect(stack).to(countResources('AWS::SQS::Queue', 1));
expect(stack).toMatch({
    Resources: {
        MyQueue: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                VisibilityTimeout: 300
            }
        }
    }
});
```

An initial integration testing utility is now available to allow users to
implement manually executed CDK integration tests and ensure they are kept
up-to-date if the code changes. This is an initial approach until we have a
great way to automatically execute them during CI/CD.

### Updates to the IAM policy library

The APIs in the IAM policy library have been improved and now provide a richer
and more strongly-typed experience.

A class hierarchy around `PolicyPrincipal` was created to reflect the various
principals available: `AccountPrincipal`, `ServicePrincipal`, `ArnPrincipal`,
`AccountRootPrincipal`.

The `Arn` type now has the ability to format and parse to/from its components:

```ts
Arn.fromComponents({
    service: 'dynamodb',
    resource: 'table',
    account: '123456789012',
    region: 'us-east-1',
    partition: 'aws-cn',
    resourceName: 'mytable/stream/label'
});

// and
const bucketArn = Arn.parse('arn:aws:s3:::my_corporate_bucket')
// bucketArn === { partition: 'aws', service: 's3', resource: 'my_corporate_bucket' }
```

The `Permission` class was renamed to `PolicyStatement` and enriched with more
strongly typed APIs.

### A new library for defining custom CloudFormation resources

A library to facilitate the definition of custom CloudFormation resources and
exposing them as regular CDK constructs is now shipped with the CDK.

## 0.5.0 - 2018-03-29

### AWS Resource Constructs (L1)

* All CloudFormation resource constructs are now available from the
  __@aws-cdk/resources__ package under their dedicated AWS service's namespace.
  we have been calling these resource constructs __Layer 1__ (or "L1
  constructs").
* All resource constructs now have the __Resource__ suffix (__TableResource__
  instead of `Table`). This helps differentiate them from the rich AWS
  constructs we are also introducing in this release.
* The CloudFormation resource property "Name" is now called "xxxName" (where
  "xxx" is the name of the resource, like "queue") instead of "resourceName".
* Updated resources based on the latest CloudFormation resource specification.

Before:

```js
import { Pipeline } from '@aws-cdk/codepipeline';

new Pipeline(this, {
    resourceName: 'MyPipelineName'
});
```

After:

```js
import { codepipeline } from '@aws-cdk/resources';

new codepipeline.PipelineResource(this, {
    pipelineName: 'MyPipelineName'
});
```

### Framework

* Introducing __CDK Applets__ which allow instantiating specific CDK stacks
  using a declarative YAML syntax.
* As a first step to enable diagnostics features in the toolkit, record logical
  ID (and stack trace) in metadata for stack elements.
* Introduce a new scheme for generating CloudFormation logical IDs which adds a
  hash of the construct path to the generated ID to avoid ID collisions. To
  opt-in for the new scheme, set `hashedLogicalIDs` to `true` when creating a
  __Stack__.
* Allow specifying explicit __logicalID__ for stack elements like __Resource__
  __Parameter__ and __Output__.
* `async exec()` changed to `run()` and `validate` was changed to be a
  synchronous method instead of async.
* Merged __@aws-cdk/core__ into __aws-cdk__, which now where the core classes of
  the CDK framework live.
* The __Runtime Values__ library, which was under __@aws-cdk/rtv__ is now
  __@aws-cdk/rtv__.
* Bugfix: Tags could not be used because they failed validation.
* Bugfix: Allow "-" in stack names.

### Toolkit

* The toolkit is now called __CDK Toolkit__ instead of "cx Toolkit". This means
  that the `cx` command-command line program is now called `cdk`.
* Added support __large CloudFormation templates__ using a "toolkit stack" which
  contains an S3 bucket. This approach may be extended to provide other
  environment-related facilities in the future and requires that users
  "bootstrap" the toolkit stack into their environments. The current behavior
  will not require this stack unless you are trying to deploy a large template.
* It is now possible to __synthesize all stacks into a directory__.
* Allow using globs in `cdk deploy` to select multiple stacks.
* Default account ID lookup result is now cached.
* Better error messages.
* Improve deploy output.
* Bugfix: Better error message when the app has no stacks.
* Bugfix: Distinguish actual "stack missing" from "no credentials".
* Bugfix: Delete stack in unrecoverable state.
* Bugfix: Fix an issue where 'deploy' fails because subsequent invocations use
  the same argument array.
* Bugfix: prevent crash if ~/.aws/config doesn't exist.

### Documentation and Examples

* Implemented a few __advanced examples__ These examples show how to use IAM
  policies, environmental context, template inclusion, nested stacks, resource
  references and using various CloudFormation semantics in the CDK

## 0.4.0 - 2018-03-05

### New Features

 * __Environments__ - this version extends the fidelity of a CDK deployment
   target from only _region_ to _region + account_, also referred to as an
   ___environment___. This allows modeling complete apps that span multiple
   accounts/regions. To preserve the current behavior, if region/account is not
   specified, the CDK will default to the AWS SDK region/credential provider
   chain (`~/.aws/config`). We will add support for AWS SDK Profiles in a future
   release. See the __Environments__ section of the CDK README for details).
 * __Environmental Context__ (such as availability zones and SSM parameters) -
   there are use-cases where CDK stacks need to consult with account and
   region-specific information when they are synthesized (we call this
   information "environmental context"). For example, the set of supported
   __availability zones__ is specific to account _and_ region; the specific ID
   of certain public __AMIs__ (Amazon Machine Image IDs) as published to the SSM
   parameter store is specific to each region. See the __Environmental Context__
   section in the CDK README for details .
 * __Runtime Values__ - a new mechanism for advertising values such as resource
   attributes and constants from construction-time to runtime code via the SSM
   parameter store. See the __Runtime Values__ section in the CDK README for
   details.
 * __Construct Validation__ - it is now possible to implement a method
   `validate(): string[]` for any construct at any layer. Validation methods are
   all executed before a stack is synthesized and provide an opportunity for
   constructs to implement validation logic. See the __Construct Validation__
   section in the CDK README for details.
 * __User-specific cx.json__ - the toolkit will now incorporate settings from
   `~/.cx.json`. This allows users to supply user-specific settings. Note this
   file is applied _before_ the project-specific `cx.json` file is applied.
 * __IAM Library Improvements__ - allow creating IAM documents with a base
   document, a new class `AssumeRolePolicyDocument`, allow specifying multiple
   actions when creating a `Permission` ob object.
 * __`stack.findResource(logicalId)`__ - allows retriving a resource object from
   a stack based on it's calculated logical ID.
 * __Windows AMIs are read from SSM parameter store__.

### Bug Fixes

 * __cx Toolkit__ returns a non-zero exit code when an error occurs.
 * __Retain original names of CloudFormation properties__ instead of
   auto-capitalizing based on heuristics, which caused some unexpected behavior
   in certain scenarios.
 * __CAPABILITY_NAMED_IAM__ was added to "cx deploy" by default.

## 0.3.0 - 2018-01-30

### Highlights

 * Java support:

```java
class HelloJavaStack extends Stack {
    public HelloJavaStack(final Construct parent, final StackProps props) {
        super(parent, props);

        VpcNetwork vpc = new VpcNetwork(this);

        new Fleet(this, new FleetProps()
                .withVpcSubnetwork(vpc.getPrivateSubnetwork())
                .withInstanceType(new InstanceType("t2.micro"))
                .withMachineImage(new WindowsMachineImage(0)));
    }
}
```

 * **cx Toolkit** now supports standard AWS credentials.

 * CloudFormation pseudo parameters and intrinsic functions are now implemented
   as normal classes (`AwsRegion`, `AwsStackId`, `FnConcat`) instead of static
   methods. We might introduce functional sugar at a later stage, but at the
   lower-level, we want to represent both intrinsic functions and pseudo
   parameters as classes so we can model their relationship more accurately. For
   example, all pseudo parameters extend `PseudoParameter`, all functions
   extends the `Fn`, all condition functions extend `FnCondition`, etc.

Before:

```js
Fn.if_(Fn.equals(param.ref, 'True'), 'Encrypted', Pseudo.NO_VALUE)
```

After:

```js
new FnIf(new FnEquals(param.ref, 'True'), 'Encrypted', new AwsNoValue())
```

 * CloudFormation template options (`templateFormatVersion`, `description` and
   `transform`) are now grouped under `Stack.templateOptions` instead of directly
   under `Stack`.

Before:

```js
stack.description = 'This is my awesome template'
```

After:

```js
stack.templateOptions.description = 'This is my awesome template'
```
### Known Issues

 * Stack names are limited to alphanumeric characters, so it won't be possible
   to set stack names to match existing deployed stacks. As a workaround you can
   use `cx --rename` to specify the actual stack name to use for `diff` or
   `deploy`. Thanks rmuller@ for reporting.
 * When synthesizing templates, we transform all JSON keys to pascal case to
   conform with CloudFormation standards, but this also affects JSON blobs that
   are not CloudFormation such as IAM documents or environment variables.

### Non-breaking Changes

 * Added support for __CloudFormation Rules__.
 * **Cloud Executable Interface (CXI)**: changed semantics from "construct" to
   "synthesize" (backwards compatible).
 * **Tokens**: improve error reporting when unable to resolve tokens.

## 0.2.0 - 2017-12-07

### Highlights

### Construct Names

 * The initializer signature for constructs has changed and is now: `new
   Construct(parent[, props])`, where `props` is may include an *optional*
   `name` property ("id" is now called "name").
 * If `name` is not specified, the **type name** is used as the name. This will
   only be allowed when there is a single construct of a certain type under a
   parent.
 * If a parent has more than a single child of the same type, all children must
   have an explicit names to avoid ambiguity when generating CloudFormation
   logical IDs.
 * JSX support updated to use `name` instead of `id` when producing construct
   trees.

Before:

```js
new BeautifulConstruct(this, 'MyBeautifulConstruct', { ...props })
```

After:

```js
new BeautifulConstruct(this) // use defaults
new BeautifulConstruct(this, { ...props })
// or
new BeautifulConstruct(this, { name: 'MyBeautifulConstruct', ...props })
```

### Resource Attribute Types

 * CloudFormation resource attribute properties now return a specialized type
   per attribute. For example, the `sqs.queueArn` property returns a
   `QueueArnAttribute` object instead of a `Token`.
 * The `Attribute` and `ArnAttribute` classes extend `Token` and used as base
   classes for attribute types.
 * Resource names are now added as a prefix to attribute properties (`queueArn`
   instead of `arn`). This is required for future support for duck-typing and
   polymorphic use of resources of multiple types via a single container.

Before:

```js
const t = new aws.dynamodb.Table(this);
assert(t.arn instanceof Token);
```

After:

```js
const t = new aws.dynamodb.Table(this);
assert(t.tableArn instanceOf TableArnAttribute);
assert(t.tableArn instanceOf ArnAttribute);
assert(t.tableArn instanceOf Token);
```

### Construct Metadata

 * Constructs can now have **metadata** entries attached to them via
   `addMetadata(type,data)`.
 * Each entry will also include the *stack trace* from which the entry was
   added, which will later be used to improve the diagnosability of deployment
   errors.
 * Stack metadata can be obtained using cx-Toolkit via `cx metadata`.
 * `construct.addWarning(msg)` attaches a "warning" metadata entry to a
   construct, which is displayed as a warning when synthesizing or deploying the
   stack.
 * cx-Toolkit will show warnings upon synthesis also supports `--strict` mode
   which will refuse to deploy stacks with warnings.

Example:

```js
const c = new Construct(this);
c.addWarning('this is a warning');
c.addMetadata('type', 'data');
```

```bash
$ cx metadata
{
  "/Stack/Construct": [
    {
      "type": "type",
      "data": "data",
      "trace": [ ... ]
    },
    {
      "type": "warning",
      "data": "this is a warning",
      "trace": [ ... ]
    }
  ]
}
```

```bash
$ cx synth
Warning: this is a warning (at /Stack/Construct)
...
```

### Resource Enrichments

 * Replaced `topic.subscribeToXxx` with `topic.subscribe(target)` where `target`
   is anything that adheres to the `SubscriptionTarget` interface (technically
   it's an abstract class because jsii doesn't support interfaces yet).
 * Removed `function.addExecutionRole()` - an execution role is automatically
   created when invoking `function.addPermission(p)`.

### Tokens

 * The `evaluate` method is now called `resolve`.

### CX Toolkit Usability Improvements

 * If an app contains a single stack, no need to specify the stack name.
 * `synth --interactive` (or `synth --interactive --verbose`) now displays
   real-time updates of a template's contents. Really nice for fast iteration;
 * The toolkit now reads `cx.json` for default arguments. Very useful, for
   example, to remove the need to specify `--app` in every invocation.

