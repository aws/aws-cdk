# AWS AppConfig Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

For a high level overview of what AWS AppConfig is and how it works, please take a look here:
[What is AWS AppConfig?](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html)


## Basic Hosted Configuration Use Case

> The main way most AWS AppConfig users utilize the service is through hosted configuration, which involves storing
> configuration data directly within AWS AppConfig.

An example use case:

```ts
const app = new appconfig.Application(this, 'MyApp');
const env = new appconfig.Environment(this, 'MyEnv', {
  application: app,
});

new appconfig.HostedConfiguration(this, 'MyHostedConfig', {
  application: app,
  deployTo: [env],
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
});
```

This will create the application and environment for your configuration and then deploy your configuration to the
specified environment.

For more information about what these resources are: [Creating feature flags and free form configuration data in AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/creating-feature-flags-and-configuration-data.html).

For more information about deploying configuration: [Deploying feature flags and configuration data in AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/deploying-feature-flags.html)

____

For an in-depth walkthrough of specific resources and how to use them, please take a look at the following sections.

## Application

[AWS AppConfig Application Documentation](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-namespace.html)

In AWS AppConfig, an application is simply an organizational
construct like a folder. Configurations and environments are
associated with the application.

When creating an application through CDK, the name and
description of an application are optional.

Create a simple application:

```ts
new appconfig.Application(this, 'MyApplication');
```

## Environment

[AWS AppConfig Environment Documentation](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-environment.html)

Basic environment with monitors:

```ts
declare const application: appconfig.Application;
declare const alarm: cloudwatch.Alarm;
declare const compositeAlarm: cloudwatch.CompositeAlarm;

new appconfig.Environment(this, 'MyEnvironment', {
  application,
  monitors: [
    appconfig.Monitor.fromCloudWatchAlarm(alarm),
    appconfig.Monitor.fromCloudWatchAlarm(compositeAlarm),
  ],
});
```

Environment monitors also support L1 `CfnEnvironment.MonitorsProperty` constructs through the `fromCfnMonitorsProperty` method.
However, this is not the recommended approach for CloudWatch alarms because a role will not be auto-generated if not provided.

See [About the AWS AppConfig data plane service](https://docs.aws.amazon.com/appconfig/latest/userguide/about-data-plane.html) for more information.

### Permissions

You can grant read permission on the environment's configurations with the grantReadConfig method as follows:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new appconfig.Application(this, 'MyAppConfig');
const env = new appconfig.Environment(this, 'MyEnvironment', {
  application: app,
});

const user = new iam.User(this, 'MyUser');
env.grantReadConfig(user);
```


## Deployment Strategy

[AWS AppConfig Deployment Strategy Documentation](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html)

A deployment strategy defines how a configuration will roll out. The roll out is defined by four parameters: deployment type,
growth factor, deployment duration, and final bake time.

Deployment strategy with predefined values:

```ts
new appconfig.DeploymentStrategy(this, 'MyDeploymentStrategy', {
  rolloutStrategy: appconfig.RolloutStrategy.CANARY_10_PERCENT_20_MINUTES,
});
```

Deployment strategy with custom values:

```ts
new appconfig.DeploymentStrategy(this, 'MyDeploymentStrategy', {
  rolloutStrategy: appconfig.RolloutStrategy.linear({
    growthFactor: 20,
    deploymentDuration: Duration.minutes(30),
    finalBakeTime: Duration.minutes(30),
  }),
});
```

Referencing a deployment strategy by ID:

```ts
appconfig.DeploymentStrategy.fromDeploymentStrategyId(this, 'MyImportedDeploymentStrategy', appconfig.DeploymentStrategyId.fromString('abc123'));
```

Referencing an AWS AppConfig predefined deployment strategy by ID:

```ts
appconfig.DeploymentStrategy.fromDeploymentStrategyId(
  this,
  'MyImportedPredefinedDeploymentStrategy',
  appconfig.DeploymentStrategyId.CANARY_10_PERCENT_20_MINUTES,
);
```

## Configuration

A configuration is a higher-level construct that can either be a `HostedConfiguration` (stored internally through AWS
AppConfig) or a `SourcedConfiguration` (stored in an Amazon S3 bucket, AWS Secrets Manager secrets, Systems Manager (SSM)
Parameter Store parameters, SSM documents, or AWS CodePipeline). This construct manages deployments on creation.

### HostedConfiguration

A hosted configuration represents configuration stored in the AWS AppConfig hosted configuration store. A hosted configuration
takes in the configuration content and associated AWS AppConfig application. On construction of a hosted configuration, the
configuration is deployed.

You can define hosted configuration content using any of the following ConfigurationContent methods:

* `fromFile` - Defines the hosted configuration content from a file (you can specify a relative path). The content type will
be determined by the file extension unless specified.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromFile('config.json'),
});
```

* `fromInlineText` - Defines the hosted configuration from inline text. The content type will be set as `text/plain`.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
});
```

* `fromInlineJson` - Defines the hosted configuration from inline JSON. The content type will be set as `application/json` unless specified.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineJson('{}'),
});
```

* `fromInlineYaml` - Defines the hosted configuration from inline YAML. The content type will be set as `application/x-yaml`.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineYaml('MyConfig: This is my content.'),
});
```

* `fromInline` - Defines the hosted configuration from user-specified content types. The content type will be set as `application/octet-stream` unless specified.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInline('This is my configuration content.'),
});
```

AWS AppConfig supports the following types of configuration profiles.

* **[Feature flag](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-feature-flags.html)**: Use a feature flag configuration to turn on new features that require a timely deployment, such as a product launch or announcement.
* **[Freeform](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-free-form-configurations-creating.html)**: Use a freeform configuration to carefully introduce changes to your application.

A hosted configuration with type:

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
  type: appconfig.ConfigurationType.FEATURE_FLAGS,
});
```

When you create a configuration and configuration profile, you can specify up to two validators. A validator ensures that your
configuration data is syntactically and semantically correct. You can create validators in either JSON Schema or as an AWS
Lambda function.
See [About validators](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile.html#appconfig-creating-configuration-and-profile-validators) for more information.

When you import a JSON Schema validator from a file, you can pass in a relative path.

A hosted configuration with validators:

```ts
declare const application: appconfig.Application;
declare const fn: lambda.Function;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
  validators: [
    appconfig.JsonSchemaValidator.fromFile('schema.json'),
    appconfig.LambdaValidator.fromFunction(fn),
  ],
});
```

You can attach a deployment strategy (as described in the previous section) to your configuration to specify how you want your
configuration to roll out.

A hosted configuration with a deployment strategy:

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
  deploymentStrategy: new appconfig.DeploymentStrategy(this, 'MyDeploymentStrategy', {
    rolloutStrategy: appconfig.RolloutStrategy.linear({
      growthFactor: 15,
      deploymentDuration: Duration.minutes(30),
      finalBakeTime: Duration.minutes(15),
    }),
  }),
});
```

The `deployTo` parameter is used to specify which environments to deploy the configuration to.

A hosted configuration with `deployTo`:

```ts
declare const application: appconfig.Application;
declare const env: appconfig.Environment;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
  deployTo: [env],
});
```

When more than one configuration is set to deploy to the same environment, the
deployments will occur one at a time. This is done to satisfy
[AppConfig's constraint](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-deploying.html):
> [!NOTE]
> You can only deploy one configuration at a time to an environment.
> However, you can deploy one configuration each to different environments at the same time.

The deployment order matches the order in which the configurations are declared.

```ts
const app = new appconfig.Application(this, 'MyApp');
const env = new appconfig.Environment(this, 'MyEnv', {
  application: app,
});

new appconfig.HostedConfiguration(this, 'MyFirstHostedConfig', {
  application: app,
  deployTo: [env],
  content: appconfig.ConfigurationContent.fromInlineText('This is my first configuration content.'),
});

new appconfig.HostedConfiguration(this, 'MySecondHostedConfig', {
  application: app,
  deployTo: [env],
  content: appconfig.ConfigurationContent.fromInlineText('This is my second configuration content.'),
});
```

If an application would benefit from a deployment order that differs from the
declared order, you can defer the decision by using `IEnvironment.addDeployment`
rather than the `deployTo` property.
In this example, `firstConfig` will be deployed before `secondConfig`.

```ts
const app = new appconfig.Application(this, 'MyApp');
const env = new appconfig.Environment(this, 'MyEnv', {
  application: app,
});

const secondConfig = new appconfig.HostedConfiguration(this, 'MySecondHostedConfig', {
  application: app,
  content: appconfig.ConfigurationContent.fromInlineText('This is my second configuration content.'),
});

const firstConfig = new appconfig.HostedConfiguration(this, 'MyFirstHostedConfig', {
  application: app,
  deployTo: [env],
  content: appconfig.ConfigurationContent.fromInlineText('This is my first configuration content.'),
});

env.addDeployment(secondConfig);
```

Alternatively, you can defer multiple deployments in favor of
`IEnvironment.addDeployments`, which allows you to declare multiple
configurations in the order they will be deployed.
In this example the deployment order will be
`firstConfig`, then `secondConfig`, and finally `thirdConfig`.

```ts
const app = new appconfig.Application(this, 'MyApp');
const env = new appconfig.Environment(this, 'MyEnv', {
  application: app,
});

const secondConfig = new appconfig.HostedConfiguration(this, 'MySecondHostedConfig', {
  application: app,
  content: appconfig.ConfigurationContent.fromInlineText('This is my second configuration content.'),
});

const thirdConfig = new appconfig.HostedConfiguration(this, 'MyThirdHostedConfig', {
  application: app,
  content: appconfig.ConfigurationContent.fromInlineText('This is my third configuration content.'),
});

const firstConfig = new appconfig.HostedConfiguration(this, 'MyFirstHostedConfig', {
  application: app,
  content: appconfig.ConfigurationContent.fromInlineText('This is my first configuration content.'),
});

env.addDeployments(firstConfig, secondConfig, thirdConfig);
```

Any mix of `deployTo`, `addDeployment`, and `addDeployments` is permitted.
The declaration order will be respected regardless of the approach used.

> [!IMPORTANT]
> If none of these options are utilized, there will not be any deployments.

### SourcedConfiguration

A sourced configuration represents configuration stored in any of the following:

* Amazon S3 bucket
* AWS Secrets Manager secret
* Systems Manager
* (SSM) Parameter Store parameter
* SSM document
* AWS CodePipeline.

A sourced configuration takes in the location source
construct and optionally a version number to deploy. On construction of a sourced configuration, the configuration is deployed
only if a version number is specified.

### S3

Use an Amazon S3 bucket to store a configuration.

```ts
declare const application: appconfig.Application;

const bucket = new s3.Bucket(this, 'MyBucket', {
  versioned: true,
});

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
});
```

Use an encrypted bucket:

```ts
declare const application: appconfig.Application;

const bucket = new s3.Bucket(this, 'MyBucket', {
  versioned: true,
  encryption: s3.BucketEncryption.KMS,
});

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
});
```

### AWS Secrets Manager secret

Use a Secrets Manager secret to store a configuration.

```ts
declare const application: appconfig.Application;
declare const secret: secrets.Secret;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromSecret(secret),
});
```

### SSM Parameter Store parameter

Use an SSM parameter to store a configuration.

```ts
declare const application: appconfig.Application;
declare const parameter: ssm.StringParameter;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromParameter(parameter),
  versionNumber: '1',
});
```

### SSM document

Use an SSM document to store a configuration.

```ts
declare const application: appconfig.Application;
declare const document: ssm.CfnDocument;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromCfnDocument(document),
});
```

### AWS CodePipeline

Use an AWS CodePipeline pipeline to store a configuration.

```ts
declare const application: appconfig.Application;
declare const pipeline: codepipeline.Pipeline;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromPipeline(pipeline),
});
```

Similar to a hosted configuration, a sourced configuration can optionally take in a type, validators, a `deployTo` parameter, and a deployment strategy.

A sourced configuration with type:

```ts
declare const application: appconfig.Application;
declare const bucket: s3.Bucket;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
  type: appconfig.ConfigurationType.FEATURE_FLAGS,
  name: 'MyConfig',
  description: 'This is my sourced configuration from CDK.',
});
```

A sourced configuration with validators:

```ts
declare const application: appconfig.Application;
declare const bucket: s3.Bucket;
declare const fn: lambda.Function;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
  validators: [
    appconfig.JsonSchemaValidator.fromFile('schema.json'),
    appconfig.LambdaValidator.fromFunction(fn),
  ],
});
```

A sourced configuration with a deployment strategy:

```ts
declare const application: appconfig.Application;
declare const bucket: s3.Bucket;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
  deploymentStrategy: new appconfig.DeploymentStrategy(this, 'MyDeploymentStrategy', {
    rolloutStrategy: appconfig.RolloutStrategy.linear({
      growthFactor: 15,
      deploymentDuration: Duration.minutes(30),
      finalBakeTime: Duration.minutes(15),
    }),
  }),
});
```

## Extension

An extension augments your ability to inject logic or behavior at different points during the AWS AppConfig workflow of
creating or deploying a configuration.
See: https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html

### AWS Lambda destination

Use an AWS Lambda as the event destination for an extension.

```ts
declare const fn: lambda.Function;

new appconfig.Extension(this, 'MyExtension', {
  actions: [
    new appconfig.Action({
      actionPoints: [appconfig.ActionPoint.ON_DEPLOYMENT_START],
      eventDestination: new appconfig.LambdaDestination(fn),
    }),
  ],
});
```

Lambda extension with parameters:

```ts
declare const fn: lambda.Function;

new appconfig.Extension(this, 'MyExtension', {
  actions: [
    new appconfig.Action({
      actionPoints: [appconfig.ActionPoint.ON_DEPLOYMENT_START],
      eventDestination: new appconfig.LambdaDestination(fn),
    }),
  ],
  parameters: [
    appconfig.Parameter.required('testParam', 'true'),
    appconfig.Parameter.notRequired('testNotRequiredParam'),
  ]
});
```


### Amazon Simple Queue Service (SQS) destination

Use a queue as the event destination for an extension.

```ts
declare const queue: sqs.Queue;

new appconfig.Extension(this, 'MyExtension', {
  actions: [
    new appconfig.Action({
      actionPoints: [appconfig.ActionPoint.ON_DEPLOYMENT_START],
      eventDestination: new appconfig.SqsDestination(queue),
    }),
  ],
});
```

### Amazon Simple Notification Service (SNS) destination

Use an SNS topic as the event destination for an extension.

```ts
declare const topic: sns.Topic;

new appconfig.Extension(this, 'MyExtension', {
  actions: [
    new appconfig.Action({
      actionPoints: [appconfig.ActionPoint.ON_DEPLOYMENT_START],
      eventDestination: new appconfig.SnsDestination(topic),
    }),
  ],
});
```

### Amazon EventBridge destination

Use the default event bus as the event destination for an extension.

```ts
const bus = events.EventBus.fromEventBusName(this, 'MyEventBus', 'default');

new appconfig.Extension(this, 'MyExtension', {
  actions: [
    new appconfig.Action({
      actionPoints: [appconfig.ActionPoint.ON_DEPLOYMENT_START],
      eventDestination: new appconfig.EventBridgeDestination(bus),
    }),
  ],
});
```

You can also add extensions and their associations directly by calling `onDeploymentComplete()` or any other action point
method on the AWS AppConfig application, configuration, or environment resource. To add an association to an existing
extension, you can call `addExtension()` on the resource.

Adding an association to an AWS AppConfig application:

```ts
declare const application: appconfig.Application;
declare const extension: appconfig.Extension;
declare const lambdaDestination: appconfig.LambdaDestination;

application.addExtension(extension);
application.onDeploymentComplete(lambdaDestination);
```
