[@rix0rrr]:         https://github.com/rix0rrr
[@sam-goodwin]:     https://github.com/sam-goodwin
[@RomainMuller]:    https://github.com/RomainMuller
[@eladb]:           https://github.com/eladb
[@skinny85]:        https://github.com/skinny85
[@moofish32]:       https://github.com/moofish32
[@mpiroc]:          https://github.com/mpiroc
[@Doug-AWS]:        https://github.com/Doug-AWS
[@mindstorms6]:     https://github.com/mindstorms6
[@Mortifera]:       https://github.com/Mortifera
[@maciejwalkowiak]: https://github.com/maciejwalkowiak
[@cookejames]:      https://github.com/cookejames
[@rhboyd]:          https://github.com/rhboyd
[@SeekerWing]:      https://github.com/SeekerWing
[@jungseoklee]:     https://github.com/jungseoklee

## 0.9.0 -- 2018-09-10

The headliners of this release are __.NET support__, and a wealth of commits by external contributors who are stepping
up to fix the CDK for their use cases! Thanks all for the effort put into this release!

### Features

* Add strongly-named .NET targets, and a `cdk init` template for C# projects ([@mpiroc] in [#617](https://github.com/awslabs/aws-cdk/pull/617), [#643](https://github.com/awslabs/aws-cdk/pull/643)).
* __@aws-cdk/aws-autoscaling__: Allow attaching additional security groups to Launch Configuration ([@moofish32] in [#636](https://github.com/awslabs/aws-cdk/pull/636)).
* __@aws-cdk/aws-autoscaling__: Support update and creation policies on AutoScalingGroups ([@rix0rrr] in [#595](https://github.com/awslabs/aws-cdk/pull/595)).
* __@aws-cdk/aws-codebuild__: Add support for running script from an asset ([@rix0rrr] in [#677](https://github.com/awslabs/aws-cdk/pull/677)).
* __@aws-cdk/aws-codebuild__: New method `addBuildToPipeline` on Project ([@skinny85] in [783dcb3](https://github.com/awslabs/aws-cdk/commit/783dcb3bd10058a25785d0964b37c181617a203a)).
* __@aws-cdk/aws-codecommit__: New method `addToPipeline` on Repository ([@skinny85] in [#616](https://github.com/awslabs/aws-cdk/pull/616)).
* __@aws-cdk/aws-codedeploy__: Add initial support for CodeDeploy ([@skinny85] in [#593](https://github.com/awslabs/aws-cdk/pull/593), [#641](https://github.com/awslabs/aws-cdk/pull/641)).
* __@aws-cdk/aws-dynamodb__: Add support for DynamoDB autoscaling ([@SeekerWing] in [#637](https://github.com/awslabs/aws-cdk/pull/637)).
* __@aws-cdk/aws-dynamodb__: Add support for DynamoDB streams ([@rhboyd] in [#633](https://github.com/awslabs/aws-cdk/pull/633)).
* __@aws-cdk/aws-dynamodb__: Add support for server-side encryption ([@jungseoklee] in [#684](https://github.com/awslabs/aws-cdk/pull/864)).
* __@aws-cdk/aws-ec2__ (_**BREAKING**_): SecurityGroup can now be used as a Connectable [#582](https://github.com/awslabs/aws-cdk/pull/582)).
* __@aws-cdk/aws-ec2__: Add VPC tagging ([@moofish] in [#538](https://github.com/awslabs/aws-cdk/pull/538)).
* __@aws-cdk/aws-ec2__: Add support for `InstanceSize.Nano` ([@rix0rrr] in [#581](https://github.com/awslabs/aws-cdk/pull/581))
* __@aws-cdk/aws-lambda__: Add support for dead letter queues ([@SeekerWing] in [#663](https://github.com/awslabs/aws-cdk/pull/663)).
* __@aws-cdk/aws-lambda__: Add support for placing a Lambda in a VPC ([@rix0rrr] in [#598](https://github.com/awslabs/aws-cdk/pull/598)).
* __@aws-cdk/aws-logs__: Add `extractMetric()` helper function ([@rix0rrr] in [#676](https://github.com/awslabs/aws-cdk/pull/676)).
* __@aws-cdk/aws-rds__: Add support for Aurora PostreSQL/MySQL engines ([@cookejames] in [#586](https://github.com/awslabs/aws-cdk/pull/586))
* __@aws-cdk/aws-s3__: Additional grant methods for Buckets ([@eladb] in [#591](https://github.com/awslabs/aws-cdk/pull/591))
* __@aws-cdk/aws-s3__: New method `addToPipeline` on Bucket ([@skinny85] in [c8b7a49](https://github.com/awslabs/aws-cdk/commit/c8b7a494259ad08bbd722564591e320888e47c48)).
* __aws-cdk__: Add support for HTTP proxies ([@rix0rrr] in [#666](https://github.com/awslabs/aws-cdk/pull/666)).
* __aws-cdk__: Toolkit now shows failure reason if stack update fails ([@rix0rrr] in [#609](https://github.com/awslabs/aws-cdk/pull/609)).
* __cdk-build-tools__: Add support for running experiment JSII versions ([@RomainMuller] in [#649](https://github.com/awslabs/aws-cdk/pull/649)).

### Changes

* _**BREAKING**_: Generate classes and types for the CloudFormation resource `.ref` attributes ([@rix0rrr] in [#627](https://github.com/awslabs/aws-cdk/pull/627)).
* _**BREAKING**_: Make types accepted in Policy-related classes narrower (from `any` to `Arn`, for example) to reduce typing mistakes ([@rix0rrr] in [#629](https://github.com/awslabs/aws-cdk/pull/629)).
* __@aws-cdk/aws-codepipeline__ (_**BREAKING**_): Align the CodePipeline APIs ([@skinny85] in [#492](https://github.com/awslabs/aws-cdk/pull/492), [#568](https://github.com/awslabs/aws-cdk/pull/568))
* __@aws-cdk/aws-ec2__ (_**BREAKING**_): Move Fleet/AutoScalingGroup to its own package ([@rix0rrr] in [#608](https://github.com/awslabs/aws-cdk/pull/608)).
* __aws-cdk__: Simplify plugin protocol ([@RomainMuller] in [#646](https://github.com/awslabs/aws-cdk/pull/646)).

### Bug Fixes

* __@aws-cdk/aws-cloudfront__: Fix CloudFront behavior for ViewerProtocolPolicy ([@mindstorms6] in [#615](https://github.com/awslabs/aws-cdk/pull/615)).
* __@aws-cdk/aws-ec2__: VPC Placement now supports picking Isolated subnets ([@rix0rrr] in [#610](https://github.com/awslabs/aws-cdk/pull/610)).
* __@aws-cdk/aws-logs__: Add `export()/import()` capabilities ([@rix0rrr] in [#630](https://github.com/awslabs/aws-cdk/pull/630)).
* __@aws-cdk/aws-rds__: Fix a bug where a cluster with 1 instance could not be created ([@cookejames] in [#578](https://github.com/awslabs/aws-cdk/pull/578))
* __@aws-cdk/aws-s3__: Bucket notifications can now add dependencies, fixing creation order ([@eladb] in [#584](https://github.com/awslabs/aws-cdk/pull/584)).
* __@aws-cdk/aws-s3__: Remove useless bucket name validation ([@rix0rrr] in [#628](https://github.com/awslabs/aws-cdk/pull/628)).
* __@aws-cdk/aws-sqs__: Make `QueueRef.encryptionMasterKey` readonly ([@RomainMuller] in [#650](https://github.com/awslabs/aws-cdk/pull/650)).
* __assets__: S3 read permissions are granted on a prefix to fix lost permissions during asset update ([@rix0rrr] in [#510](https://github.com/awslabs/aws-cdk/pull/510)).
* __aws-cdk__: Remove bootstrapping error if multiple stacks are in the same environment ([@RomainMuller] in [#625](https://github.com/awslabs/aws-cdk/pull/625)).
* __aws-cdk__: Report and continue if git throws errors during `cdk init` ([@rix0rrr] in [#587](https://github.com/awslabs/aws-cdk/pull/587)).

### CloudFormation Changes

* __@aws-cdk/cfnspec__: Updated [CloudFormation resource specification] to `v2.6.0` ([@RomainMuller] in [#594](https://github.com/awslabs/aws-cdk/pull/594))
  + **New AWS Construct Library**
    - `@aws-cdk/aws-sagemaker` supports AWS::SageMaker resources
  + **New Resource Types**
    - AWS::AmazonMQ::Broker
    - AWS::AmazonMQ::Configuration
    - AWS::CodePipeline::Webhook
    - AWS::Config::AggregationAuthorization
    - AWS::Config::ConfigurationAggregator
    - AWS::EC2::VPCEndpointConnectionNotification
    - AWS::EC2::VPCEndpointServicePermissions
    - AWS::IAM::ServiceLinkedRole
    - AWS::SSM::ResourceDataSync
    - AWS::SageMaker::Endpoint
    - AWS::SageMaker::EndpointConfig
    - AWS::SageMaker::Model
    - AWS::SageMaker::NotebookInstance
    - AWS::SageMaker::NotebookInstanceLifecycleConfig
  + **Attribute Changes**
    - AWS::CodePipeline::Pipeline Version (__added__)
  + **Property Changes**
    - AWS::AppSync::DataSource HttpConfig (__added__)
    - AWS::DAX::Cluster SSESpecification (__added__)
    - AWS::DynamoDB::Table Stream (__added__)
    - AWS::DynamoDB::Table AutoScalingSupport (__added__)
    - AWS::EC2::VPCEndpoint IsPrivateDnsEnabled (__added__)
    - AWS::EC2::VPCEndpoint SecurityGroupIds (__added__)
    - AWS::EC2::VPCEndpoint SubnetIds (__added__)
    - AWS::EC2::VPCEndpoint VPCEndpointType (__added__)
    - AWS::EC2::VPCEndpoint RouteTableIds.DuplicatesAllowed (__deleted__)
    - AWS::EC2::VPCPeeringConnection PeerRegion (__added__)
    - AWS::EFS::FileSystem ProvisionedThroughputInMibps (__added__)
    - AWS::EFS::FileSystem ThroughputMode (__added__)
    - AWS::EMR::Cluster KerberosAttributes (__added__)
    - AWS::Glue::Classifier JsonClassifier (__added__)
    - AWS::Glue::Classifier XMLClassifier (__added__)
    - AWS::Glue::Crawler Configuration (__added__)
    - AWS::Lambda::Lambda DLQConfigurationSupport (__added__)
    - AWS::Neptune::DBInstance DBSubnetGroupName.UpdateType (__changed__)
      - Old: Mutable
      - New: Immutable
    - AWS::SNS::Subscription DeliveryPolicy (__added__)
    - AWS::SNS::Subscription FilterPolicy (__added__)
    - AWS::SNS::Subscription RawMessageDelivery (__added__)
    - AWS::SNS::Subscription Region (__added__)
    - AWS::SQS::Queue Tags (__added__)
    - AWS::ServiceDiscovery::Service HealthCheckCustomConfig (__added__)
  + **Property Type Changes**
    - AWS::AppSync::DataSource.HttpConfig (__added__)
    - AWS::DAX::Cluster.SSESpecification (__added__)
    - AWS::EMR::Cluster.KerberosAttributes (__added__)
    - AWS::Glue::Classifier.JsonClassifier (__added__)
    - AWS::Glue::Classifier.XMLClassifier (__added__)
    - AWS::ServiceDiscovery::Service.HealthCheckCustomConfig (__added__)
    - AWS::CloudFront::Distribution.CacheBehavior FieldLevelEncryptionId (__added__)
    - AWS::CloudFront::Distribution.DefaultCacheBehavior FieldLevelEncryptionId (__added__)
    - AWS::CodeBuild::Project.Artifacts EncryptionDisabled (__added__)
    - AWS::CodeBuild::Project.Artifacts OverrideArtifactName (__added__)
    - AWS::CodeBuild::Project.Environment Certificate (__added__)
    - AWS::CodeBuild::Project.Source ReportBuildStatus (__added__)
    - AWS::ServiceDiscovery::Service.DnsConfig RoutingPolicy (__added__)
    - AWS::WAF::WebACL.ActivatedRule Action.Required (__changed__)
      - Old: true
      - New: false

* __@aws-cdk/cfnspec__: Updated Serverless Application Model (SAM) Resource Specification ([@RomainMuller] in [#594](https://github.com/awslabs/aws-cdk/pull/594))
  + **Property Changes**
    - AWS::Serverless::Api MethodSettings (__added__)
  + **Property Type Changes**
    - AWS::Serverless::Function.SQSEvent (__added__)
    - AWS::Serverless::Function.EventSource Properties.Types (__changed__)
      - Added SQSEvent

## 0.8.2 - 2018-08-15

### Features

* __@aws-cdk/cdk__: Tokens can now be transparently embedded into strings and encoded into JSON without losing their
  semantics. This makes it possible to treat late-bound (deploy-time) values as if they were regular strings ([@rix0rrr]
  in [#518](https://github.com/awslabs/aws-cdk/pull/518)).
* __@aws-cdk/aws-s3__: add support for bucket notifications to Lambda, SNS, and SQS targets ([@eladb] in
  [#201](https://github.com/awslabs/aws-cdk/pull/201), [#560](https://github.com/awslabs/aws-cdk/pull/560),
  [#561](https://github.com/awslabs/aws-cdk/pull/561), [#564](https://github.com/awslabs/aws-cdk/pull/564))
* __@aws-cdk/cdk__: non-alphanumeric characters can now be used as construct identifiers ([@eladb] in
  [#556](https://github.com/awslabs/aws-cdk/pull/556))
* __@aws-cdk/aws-iam__: add support for `maxSessionDuration` for Roles ([@eladb] in
  [#545](https://github.com/awslabs/aws-cdk/pull/545)).

### Changes

* __@aws-cdk/aws-lambda__ (_**BREAKING**_): most classes renamed to be shorter and more in line with official service
  naming (`Lambda` renamed to `Function` or ommitted) ([@eladb] in [#550](https://github.com/awslabs/aws-cdk/pull/550))
* __@aws-cdk/aws-codepipeline__ (_**BREAKING**_): move all CodePipeline actions from `@aws-cdk/aws-xxx-codepipeline` packages
  into the regular `@aws-cdk/aws-xxx` service packages ([@skinny85] in [#459](https://github.com/awslabs/aws-cdk/pull/459)).
* __@aws-cdk/aws-custom-resources__ (_**BREAKING**_): package was removed, and the Custom Resource construct added to
  the __@aws-cdk/aws-cloudformation__ package ([@rix0rrr] in [#513](https://github.com/awslabs/aws-cdk/pull/513))

### Fixes

* __@aws-cdk/aws-lambda__: Lambdas that are triggered by CloudWatch Events now show up in the console, and can only be
  triggered the indicated Event Rule. _**BREAKING**_ for middleware writers (as this introduces an API change), but
  transparent to regular consumers ([@eladb] in [#558](https://github.com/awslabs/aws-cdk/pull/558))
* __@aws-cdk/aws-codecommit__: fix a bug where `pollForSourceChanges` could not be set to `false` ([@maciejwalkowiak] in
  [#534](https://github.com/awslabs/aws-cdk/pull/534))
* __aws-cdk__: don't fail if the `~/.aws/credentials` file is missing ([@RomainMuller] in
  [#541](https://github.com/awslabs/aws-cdk/pull/541))
* __@aws-cdk/aws-cloudformation__: fix a bug in the CodePipeline actions to correctly support TemplateConfiguration
  ([@mindstorms6] in [#571](https://github.com/awslabs/aws-cdk/pull/571)).
* __@aws-cdk/aws-cloudformation__: fix a bug in the CodePipeline actions to correctly support ParameterOverrides
  ([@mindstorms6] in [#574](https://github.com/awslabs/aws-cdk/pull/574)).

### Known Issues

* `cdk init` will try to init a `git` repository and fail if no global `user.name` and `user.email` have been
  configured.

## 0.8.1 - 2018-08-08

### Features

* __aws-cdk__: Support `--profile` in command-line toolkit ([@rix0rrr] in [#517](https://github.com/awslabs/aws-cdk/issues/517))
* __@aws-cdk/cdk__: Introduce `Default` construct id ([@rix0rrr] in [#496](https://github.com/awslabs/aws-cdk/issues/496))
* __@aws-cdk/aws-lambda__: Add `LambdaRuntime.DotNetCore21` ([@Mortifera] in [#507](https://github.com/awslabs/aws-cdk/issues/507))
* __@aws-cdk/runtime-values__ (_**BREAKING**_): rename 'rtv' to 'runtime-values' ([@rix0rrr] in [#494](https://github.com/awslabs/aws-cdk/issues/494))
* __@aws-cdk/aws-ec2__: Combine `Connections` and `DefaultConnections` classes ([@rix0rrr] in [#453](https://github.com/awslabs/aws-cdk/issues/453))
* __@aws-cdk/aws-codebuild__: allow `buildSpec` parameter to take a filename ([@rix0rrr] in [#470](https://github.com/awslabs/aws-cdk/issues/470))
* __@aws-cdk/aws-cloudformation-codepipeline__: add support for CloudFormation CodePipeline actions ([@mindstorms6] and [@rix0rrr] in [#525](https://github.com/awslabs/aws-cdk/pull/525)).
* __docs__: Improvements to Getting Started ([@eladb] in [#462](https://github.com/awslabs/aws-cdk/issues/462))
* __docs__: Updates to README ([@Doug-AWS] in [#456](https://github.com/awslabs/aws-cdk/issues/456))
* __docs__: Upgraded `jsii-pacmak` to `0.6.4`, which includes "language-native" type names and package coordinates ([@RomainMuller] in [awslabs/jsii#130](https://github.com/awslabs/jsii/pull/130))

### Bug fixes

* __aws-cdk__ (toolkit): Fix java `cdk init` template ([@RomainMuller] in [#490](https://github.com/awslabs/aws-cdk/issues/490))
* __@aws-cdk/cdk__ (_**BREAKING**_): Align `FnJoin` signature to CloudFormation ([@RomainMuller] in [#516](https://github.com/awslabs/aws-cdk/issues/516))
* __@aws-cdk/aws-cloudfront__: Fix origin error ([@mindstorms6] in [#514](https://github.com/awslabs/aws-cdk/issues/514))
* __@aws-cdk/aws-lambda__: Invalid cast for inline LambdaRuntime members in Java ([@eladb] in [#505](https://github.com/awslabs/aws-cdk/issues/505))
* __examples__: Fixed java examples ([@RomainMuller] in [#498](https://github.com/awslabs/aws-cdk/issues/498))

## 0.8.0 - 2018-07-31

___This is the first public release of the AWS CDK!___

* Change license to Apache-2.0 ([@RomainMuller] in [#428])
* Multiple README updates, including animated gif screencast, as preparation for
  public release ([@rix0rrr] in [#433], [@eladb] in [#439])
* Multiple documentation updates for public release ([@Doug-AWS] in [#420],
  [@eladb] in [#436])
* Toolkit (__bug fix__): Correctly account for `CDK::Metadata` in `cdk diff`
  ([@RomainMuller] in [#435])
* AWS CodeBuild (_**BREAKING**_): Usability improvements for the CodeBuild
  library ([@skinny85] in [#412])

[#412]: https://github.com/awslabs/aws-cdk/issues/412
[#435]: https://github.com/awslabs/aws-cdk/issues/435
[#439]: https://github.com/awslabs/aws-cdk/issues/439
[#428]: https://github.com/awslabs/aws-cdk/issues/428
[#433]: https://github.com/awslabs/aws-cdk/issues/433
[#436]: https://github.com/awslabs/aws-cdk/issues/436
[#420]: https://github.com/awslabs/aws-cdk/issues/420

## 0.7.4 - 2018-07-26

### Highlights

* A huge shout-out to our first external contributor, [@moofish32], for many
  valuable improvements to the EC2 VPC construct ([@moofish32] in [#250]).
* The `AWS::CDK::Metadata` resource is injected to templates to analyze usage
  and notify about deprecated modules to improve security. To opt-out, use the
  switch `--no-version-reporting` or set `version-reporting` to `false` in your
  `cdk.json` ([@RomainMuller] in [#221]).
* Added capability for bundling local assets (files/directories) and referencing
  them in CDK constructs. This allows, for example, to define Lambda functions
  with runtime code in the same project and deploy them using the toolkit
  ([@eladb] in [#371]).
* Reorganization of CodePipeline actions into separate libraries ([@skinny85] in [#401] and [#402]).
* A new library for CloudWatch Logs ([@rix0rrr] in [#307]).

### AWS Construct Library

* _**BREAKING**_: All AWS libraries renamed from `@aws-cdk/xxx` to
  `@aws-cdk/aws-xxx` in order to avoid conflicts with framework modules
  ([@RomainMuller] in [#384]).
* _**BREAKING**_: The __@aws-cdk/resources__ module has been removed.
  Low-level CloudFormation resources (e.g. `BucketResource`) are now integrated
  into their respective library under the `cloudformation` namespace to improves
  discoverability and organization of the layers ([@RomainMuller] in [#264]).

### Framework

* Introducing __CDK Assets__ which are local files or directories that can be
  "bundled" into CDK constructs and apps. During deployment assets are packaged
  (i.e. zipped), uploaded to S3 and their deployed location can be referenced in
  CDK apps via the `s3BucketName` and `s3ObjectKey` and `s3Url` and read
  permissions can be granted via `asset.grantRead(principal)` ([@eladb] in
  [#371])
* Return dummy values instead of fail synthesis if environmental context (AZs,
  SSM parameters) doesn't exist in order to support unit tests. When
  synthesizing through the toolkit, an error will be displayed if the context
  cannot be found ([@eladb] in [#227])
* Added `construct.addError(msg)`, `addWarning(msg)` and `addInfo(msg)` which
  will emit messages during synthesis via the toolkit. Errors will fail
  synthesis (unless `--ignore-errors` is used), warnings will be displayed and
  will fail synthesis if `--strict` is used ([@eladb] in [#227])

### Command Line Toolkit

* The toolkit now injects a special CloudFormation resource `AWS::CDK::Metadata`
  to all synthesized templates which includes library versions used in the app.
  This allows the CDK team to analyze usage and notify users if they use
  deprecated versions ([@RomainMuller] in [#221]).
* __Bug fix__: Fixed "unknown command: docs" ([@RomainMuller] in [#256])
* Changed output of `cdk list` to just print stack names (scripting-compatible).
  Use `cdk ls -l` to print full info ([@eladb] in [#380])

### AWS EC2

* _**BREAKING**_: Add the ability customize subnet configurations.
  Subnet allocation was changed to improve IP space efficiency. `VpcNetwork`
  instances will need to be replaced ([@moofish32] in [#250])
* _**BREAKING**_: Renamed `Fleet` to `AutoScalingGroup` to align with service
  terminology ([@RomainMuller] in [#318])

### AWS Lambda

* Supports runtime code via local files or directories through assets ([@eladb]
  in [#405])
* Support custom execution role in props ([@rix0rrr] in [#205])
* Add static `metricAllConcurrentExecutions` and
  `metricAllUnreservedConcurrentExecutions` which returns account/region-level
  metrics for all functions ([@rix0rrr] in [#379])

### AWS CloudWatch

* Added `Metric.grantMetricPutData` which grants cloudwatch:PutData
  to IAM principals ([@rix0rrr] in [#214])
* __Bug fix__: Allow text included in dashboard widgets to include characters
  that require JSON-escaping ([@eladb] in [#406]).

### AWS CloudWatch Logs (new)

* A new construct library for AWS CloudWatch Logs with support for log groups,
  metric filters, and subscription filters ([@rix0rrr] in [#307]).

### AWS S3

* Added `bucketUrl` and `urlForObject(key)` to `BucketRef` ([@eladb] in [#370])

### AWS CodeBuild

* Add CloudWatch metrics to `BuildProject` ([@eladb] in [#407])

### AWS CodePipeline

* _**BREAKING**_: Moved CodeCommit and CodeBuild and LambdaInvoke actions from
  the CodePipeline library to `@aws-cdk/aws-xxx-codepipline` modules
  ([@skinny85] in [#401] and [#402]).
* Added attributes `pipelineName` and `pipelineVersion` ([@eladb] in [#408])

### Docs

* __fix__: add instructions and fix Windows setup ([@mpiroc] in [#320])
* __fix__: show emphasis of modified code in code snippets ([@eladb] in [#396])

[#256]: https://github.com/awslabs/aws-cdk/issues/256
[#214]: https://github.com/awslabs/aws-cdk/issues/214
[#205]: https://github.com/awslabs/aws-cdk/issues/205
[#318]: https://github.com/awslabs/aws-cdk/issues/318
[#264]: https://github.com/awslabs/aws-cdk/issues/264
[#307]: https://github.com/awslabs/aws-cdk/issues/307
[#238]: https://github.com/awslabs/aws-cdk/issues/238
[#370]: https://github.com/awslabs/aws-cdk/issues/370
[#371]: https://github.com/awslabs/aws-cdk/issues/371
[#227]: https://github.com/awslabs/aws-cdk/issues/227
[#320]: https://github.com/awslabs/aws-cdk/issues/320
[#379]: https://github.com/awslabs/aws-cdk/issues/379
[#384]: https://github.com/awslabs/aws-cdk/issues/384
[#250]: https://github.com/awslabs/aws-cdk/issues/250
[#405]: https://github.com/awslabs/aws-cdk/issues/405
[#380]: https://github.com/awslabs/aws-cdk/issues/380
[#408]: https://github.com/awslabs/aws-cdk/issues/408
[#406]: https://github.com/awslabs/aws-cdk/issues/406
[#401]: https://github.com/awslabs/aws-cdk/issues/401
[#402]: https://github.com/awslabs/aws-cdk/issues/402
[#258]: https://github.com/awslabs/aws-cdk/issues/258
[#396]: https://github.com/awslabs/aws-cdk/issues/396
[#250]: https://github.com/awslabs/aws-cdk/issues/250
[#250]: https://github.com/awslabs/aws-cdk/issues/409

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
const source = new codecommit.PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

// associate the build stage with code build project
new codebuild.PipelineBuildAction(buildStage, 'build', {
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

