# AWS AppConfig Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

Use AWS AppConfig, a capability of AWS Systems Manager, to create, manage, and quickly deploy application configurations. A configuration is a collection of settings that influence the behavior of your application. You can use AWS AppConfig with applications hosted on Amazon Elastic Compute Cloud (Amazon EC2) instances, AWS Lambda, containers, mobile applications, or IoT devices. To view examples of the types of configurations you can manage by using AWS AppConfig, see [Example configurations](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile.html#appconfig-creating-configuration-and-profile-examples).

## Application

In AWS AppConfig, an application is simply an organizational construct like a folder. This organizational construct has a 
relationship with some unit of executable code. For example, you could create an application called MyMobileApp to organize and 
manage configuration data for a mobile application installed by your users. Configurations and environments are associated with 
the application.

The name and description of an application are optional.

Create a simple application:

```ts
new appconfig.Application(this, 'MyApplication');
```

Create an application with a name and description:

```ts
new appconfig.Application(this, 'MyApplication', {
  name: 'App1',
  description: 'This is my application created through CDK.',
});
```

## Deployment Strategy

A deployment strategy defines how a configuration will roll out. The roll out is defined by four parameters: deployment type, 
step percentage, deployment time, and bake time.
See: https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html

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

## Configuration

A configuration is a higher-level construct that can either be a `HostedConfiguration` (stored internally through AWS 
AppConfig) or a `SourcedConfiguration` (stored in an Amazon S3 bucket, AWS Secrets Manager secrets, Systems Manager (SSM) 
Parameter Store parameters, SSM documents, or AWS CodePipeline). This construct manages deployments on creation.

### HostedConfiguration

A hosted configuration represents configuration stored in the AWS AppConfig hosted configuration store. A hosted configuration 
takes in the configuration content and associated AWS AppConfig application. On construction of a hosted configuration, the 
configuration is deployed.

```ts
declare const application: appconfig.Application;

new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
});
```

You can define hosted configuration content using any of the following ConfigurationContent methods:

* `fromFile` - Defines the hosted configuration content from a file (you can specify a relative path).
* `fromInlineText` - Defines the hosted configuration from inline text.
* `fromInlineJson` - Defines the hosted configuration from inline JSON.
* `fromInlineYaml` - Defines the hosted configuration from inline YAML.
* `fromInline` - Defines the hosted configuration from user-specified content types.

AWS AppConfig supports the following types of configuration profiles.

* **Feature flag**: Use a feature flag configuration to turn on new features that require a timely deployment, such as a product launch or announcement.
* **Freeform**: Use a freeform configuration to carefully introduce changes to your application.

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

The `deployTo` parameter is used to specify which environments to deploy the configuration to. If this parameter is not 
specified, there will not be a deployment.

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

To deploy a configuration to an environment after initialization use the `deployTo` method:

```ts
declare const application: appconfig.Application;
declare const env: appconfig.Environment;

const config = new appconfig.HostedConfiguration(this, 'MyHostedConfiguration', {
  application,
  content: appconfig.ConfigurationContent.fromInlineText('This is my configuration content.'),
});

config.deploy(env);
```

### SourcedConfiguration

A sourced configuration represents configuration stored in an Amazon S3 bucket, AWS Secrets Manager secret, Systems Manager 
(SSM) Parameter Store parameter, SSM document, or AWS CodePipeline. A sourced configuration takes in the location source 
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

The `deployTo` parameter is used to specify which environments to deploy the configuration to. If this parameter is not 
specified, there will not be a deployment.

A sourced configuration with `deployTo`:

```ts
declare const application: appconfig.Application;
declare const bucket: s3.Bucket;
declare const env: appconfig.Environment;

new appconfig.SourcedConfiguration(this, 'MySourcedConfiguration', {
  application,
  location: appconfig.ConfigurationSource.fromBucket(bucket, 'path/to/file.json'),
  deployTo: [env],
});
```

## Environment

For each AWS AppConfig application, you define one or more environments. An environment is a logical deployment group of AWS 
AppConfig targets, such as applications in a Beta or Production environment. You can also define environments for application 
subcomponents such as the Web, Mobile, and Back-end components for your application. You can configure Amazon CloudWatch alarms 
for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls 
back the configuration.

Basic environment with monitors:

```ts
declare const application: appconfig.Application;
declare const alarm: cloudwatch.Alarm;

new appconfig.Environment(this, 'MyEnvironment', {
  application,
  monitors: [
    appconfig.Monitor.fromCloudWatchAlarm(alarm),
  ],
});
```

Environment monitors also support L1 CfnEnvironment.MonitorsProperty constructs. However, this is not the recommended approach 
for CloudWatch alarms because a role will not be auto-generated if not provided.

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
