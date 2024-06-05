# AWS CodePipeline Construct Library


## Pipeline

To construct an empty Pipeline:

```ts
// Construct an empty Pipeline
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline');
```

To give the Pipeline a nice, human-readable name:

```ts
// Give the Pipeline a nice, human-readable name
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  pipelineName: 'MyPipeline',
});
```

Be aware that in the default configuration, the `Pipeline` construct creates
an AWS Key Management Service (AWS KMS) Customer Master Key (CMK) for you to
encrypt the artifacts in the artifact bucket, which incurs a cost of
**$1/month**. This default configuration is necessary to allow cross-account
actions.

If you do not intend to perform cross-account deployments, you can disable
the creation of the Customer Master Keys by passing `crossAccountKeys: false`
when defining the Pipeline:

```ts
// Don't create Customer Master Keys
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  crossAccountKeys: false,
});
```

If you want to enable key rotation for the generated KMS keys,
you can configure it by passing `enableKeyRotation: true` when creating the pipeline.
Note that key rotation will incur an additional cost of **$1/month**.

```ts
// Enable key rotation for the generated KMS key
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  // ...
  enableKeyRotation: true,
});
```

## Stages

You can provide Stages when creating the Pipeline:

```ts
// Provide a Stage when creating a pipeline
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  stages: [
    {
      stageName: 'Source',
      actions: [
        // see below...
      ],
    },
  ],
});
```

Or append a Stage to an existing Pipeline:

```ts
// Append a Stage to an existing Pipeline
declare const pipeline: codepipeline.Pipeline;
const sourceStage = pipeline.addStage({
  stageName: 'Source',
  actions: [ // optional property
    // see below...
  ],
});
```

You can insert the new Stage at an arbitrary point in the Pipeline:

```ts
// Insert a new Stage at an arbitrary point
declare const pipeline: codepipeline.Pipeline;
declare const anotherStage: codepipeline.IStage;
declare const yetAnotherStage: codepipeline.IStage;

const someStage = pipeline.addStage({
  stageName: 'SomeStage',
  placement: {
    // note: you can only specify one of the below properties
    rightBefore: anotherStage,
    justAfter: yetAnotherStage,
  }
});
```

You can disable transition to a Stage:

```ts
// Disable transition to a stage
declare const pipeline: codepipeline.Pipeline;

const someStage = pipeline.addStage({
  stageName: 'SomeStage',
  transitionToEnabled: false,
  transitionDisabledReason: 'Manual transition only', // optional reason
})
```

This is useful if you don't want every executions of the pipeline to flow into
this stage automatically. The transition can then be "manually" enabled later on.

## Actions

Actions live in a separate package, `aws-cdk-lib/aws-codepipeline-actions`.

To add an Action to a Stage, you can provide it when creating the Stage,
in the `actions` property,
or you can use the `IStage.addAction()` method to mutate an existing Stage:

```ts
// Use the `IStage.addAction()` method to mutate an existing Stage.
declare const sourceStage: codepipeline.IStage;
declare const someAction: codepipeline.Action;
sourceStage.addAction(someAction);
```

## Custom Action Registration

To make your own custom CodePipeline Action requires registering the action provider. Look to the `JenkinsProvider` in `aws-cdk-lib/aws-codepipeline-actions` for an implementation example.

```ts
// Make a custom CodePipeline Action
new codepipeline.CustomActionRegistration(this, 'GenericGitSourceProviderResource', {
  category: codepipeline.ActionCategory.SOURCE,
  artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
  provider: 'GenericGitSource',
  version: '1',
  entityUrl: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-custom-action.html',
  executionUrl: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-custom-action.html',
  actionProperties: [
    {
      name: 'Branch',
      required: true,
      key: false,
      secret: false,
      queryable: false,
      description: 'Git branch to pull',
      type: 'String',
    },
    {
      name: 'GitUrl',
      required: true,
      key: false,
      secret: false,
      queryable: false,
      description: 'SSH git clone URL',
      type: 'String',
    },
  ],
});
```

## Cross-account CodePipelines

> Cross-account Pipeline actions require that the Pipeline has *not* been
> created with `crossAccountKeys: false`.

Most pipeline Actions accept an AWS resource object to operate on. For example:

* `S3DeployAction` accepts an `s3.IBucket`.
* `CodeBuildAction` accepts a `codebuild.IProject`.
* etc.

These resources can be either newly defined (`new s3.Bucket(...)`) or imported
(`s3.Bucket.fromBucketAttributes(...)`) and identify the resource that should
be changed.

These resources can be in different accounts than the pipeline itself. For
example, the following action deploys to an imported S3 bucket from a
different account:

```ts
// Deploy an imported S3 bucket from a different account
declare const stage: codepipeline.IStage;
declare const input: codepipeline.Artifact;
stage.addAction(new codepipeline_actions.S3DeployAction({
  bucket: s3.Bucket.fromBucketAttributes(this, 'Bucket', {
    account: '123456789012',
    // ...
  }),
  input: input,
  actionName: 's3-deploy-action',
  // ...
}));
```

Actions that don't accept a resource object accept an explicit `account` parameter:

```ts
// Actions that don't accept a resource objet accept an explicit `account` parameter
declare const stage: codepipeline.IStage;
declare const templatePath: codepipeline.ArtifactPath;
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  account: '123456789012',
  templatePath,
  adminPermissions: false,
  stackName: Stack.of(this).stackName,
  actionName: 'cloudformation-create-update',
  // ...
}));
```

The `Pipeline` construct automatically defines an **IAM Role** for you in the
target account which the pipeline will assume to perform that action. This
Role will be defined in a **support stack** named
`<PipelineStackName>-support-<account>`, that will automatically be deployed
before the stack containing the pipeline.

If you do not want to use the generated role, you can also explicitly pass a
`role` when creating the action. In that case, the action will operate in the
account the role belongs to:

```ts
// Explicitly pass in a `role` when creating an action.
declare const stage: codepipeline.IStage;
declare const templatePath: codepipeline.ArtifactPath;
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  templatePath,
  adminPermissions: false,
  stackName: Stack.of(this).stackName,
  actionName: 'cloudformation-create-update',
  // ...
  role: iam.Role.fromRoleArn(this, 'ActionRole', '...'),
}));
```

## Cross-region CodePipelines

Similar to how you set up a cross-account Action, the AWS resource object you
pass to actions can also be in different *Regions*. For example, the
following Action deploys to an imported S3 bucket from a different Region:

```ts
// Deploy to an imported S3 bucket from a different Region.
declare const stage: codepipeline.IStage;
declare const input: codepipeline.Artifact;
stage.addAction(new codepipeline_actions.S3DeployAction({
  bucket: s3.Bucket.fromBucketAttributes(this, 'Bucket', {
    region: 'us-west-1',
    // ...
  }),
  input: input,
  actionName: 's3-deploy-action',
  // ...
}));
```

Actions that don't take an AWS resource will accept an explicit `region`
parameter:

```ts
// Actions that don't take an AWS resource will accept an explicit `region` parameter.
declare const stage: codepipeline.IStage;
declare const templatePath: codepipeline.ArtifactPath;
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  templatePath,
  adminPermissions: false,
  stackName: Stack.of(this).stackName,
  actionName: 'cloudformation-create-update',
  // ...
  region: 'us-west-1',
}));
```

The `Pipeline` construct automatically defines a **replication bucket** for
you in the target region, which the pipeline will replicate artifacts to and
from. This Bucket will be defined in a **support stack** named
`<PipelineStackName>-support-<region>`, that will automatically be deployed
before the stack containing the pipeline.

If you don't want to use these support stacks, and already have buckets in
place to serve as replication buckets, you can supply these at Pipeline definition
time using the `crossRegionReplicationBuckets` parameter. Example:

```ts
// Supply replication buckets for the Pipeline instead of using the generated support stack
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  // ...

  crossRegionReplicationBuckets: {
    // note that a physical name of the replication Bucket must be known at synthesis time
    'us-west-1': s3.Bucket.fromBucketAttributes(this, 'UsWest1ReplicationBucket', {
      bucketName: 'my-us-west-1-replication-bucket',
      // optional KMS key
      encryptionKey: kms.Key.fromKeyArn(this, 'UsWest1ReplicationKey',
        'arn:aws:kms:us-west-1:123456789012:key/1234-5678-9012'
      ),
    }),
  },
});
```

See [the AWS docs here](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-cross-region.html)
for more information on cross-region CodePipelines.

### Creating an encrypted replication bucket

If you're passing a replication bucket created in a different stack,
like this:

```ts
// Passing a replication bucket created in a different stack.
const app = new App();
const replicationStack = new Stack(app, 'ReplicationStack', {
  env: {
    region: 'us-west-1',
  },
});
const key = new kms.Key(replicationStack, 'ReplicationKey');
const replicationBucket = new s3.Bucket(replicationStack, 'ReplicationBucket', {
  // like was said above - replication buckets need a set physical name
  bucketName: PhysicalName.GENERATE_IF_NEEDED,
  encryptionKey: key, // does not work!
});

// later...
new codepipeline.Pipeline(replicationStack, 'Pipeline', {
  crossRegionReplicationBuckets: {
    'us-west-1': replicationBucket,
  },
});
```

When trying to encrypt it
(and note that if any of the cross-region actions happen to be cross-account as well,
the bucket *has to* be encrypted - otherwise the pipeline will fail at runtime),
you cannot use a key directly - KMS keys don't have physical names,
and so you can't reference them across environments.

In this case, you need to use an alias in place of the key when creating the bucket:

```ts
// Passing an encrypted replication bucket created in a different stack.
const app = new App();
const replicationStack = new Stack(app, 'ReplicationStack', {
  env: {
    region: 'us-west-1',
  },
});
const key = new kms.Key(replicationStack, 'ReplicationKey');
const alias = new kms.Alias(replicationStack, 'ReplicationAlias', {
  // aliasName is required
  aliasName: PhysicalName.GENERATE_IF_NEEDED,
  targetKey: key,
});
const replicationBucket = new s3.Bucket(replicationStack, 'ReplicationBucket', {
  bucketName: PhysicalName.GENERATE_IF_NEEDED,
  encryptionKey: alias,
});
```

## Variables

Variables are key-value pairs that can be used to dynamically configure actions in your pipeline.

There are two types of variables, Action-level variables and Pipeline-level variables. Action-level
variables are produced when an action is executed. Pipeline-level variables are defined when the
pipeline is created and resolved at pipeline run time. You specify the Pipeline-level variables
when the pipeline is created, and you can provide values at the time of the pipeline execution.

### Action-level variables

The library supports action-level variables.
Each action class that emits variables has a separate variables interface,
accessed as a property of the action instance called `variables`.
You instantiate the action class and assign it to a local variable;
when you want to use a variable in the configuration of a different action,
you access the appropriate property of the interface returned from `variables`,
which represents a single variable.
Example:

```ts fixture=action
// MyAction is some action type that produces variables, like EcrSourceAction
const myAction = new MyAction({
  // ...
  actionName: 'myAction',
});
new OtherAction({
  // ...
  config: myAction.variables.myVariable,
  actionName: 'otherAction',
});
```

The namespace name that will be used will be automatically generated by the pipeline construct,
based on the stage and action name;
you can pass a custom name when creating the action instance:

```ts fixture=action
// MyAction is some action type that produces variables, like EcrSourceAction
const myAction = new MyAction({
  // ...
  variablesNamespace: 'MyNamespace',
  actionName: 'myAction',
});
```

There are also global variables available,
not tied to any action;
these are accessed through static properties of the `GlobalVariables` class:

```ts fixture=action
// OtherAction is some action type that produces variables, like EcrSourceAction
new OtherAction({
  // ...
  config: codepipeline.GlobalVariables.executionId,
  actionName: 'otherAction',
});
```

The following is an actual code example.

```ts
declare const sourceAction: codepipeline_actions.S3SourceAction;
declare const sourceOutput: codepipeline.Artifact;
declare const deployBucket: s3.Bucket;

new codepipeline.Pipeline(this, 'Pipeline', {
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.S3DeployAction({
          actionName: 'DeployAction',
          // can reference the variables
          objectKey: `${sourceAction.variables.versionId}.txt`,
          input: sourceOutput,
          bucket: deployBucket,
        }),
      ],
    },
  ],
});
```

Check the documentation of the `aws-cdk-lib/aws-codepipeline-actions`
for details on how to use the variables for each action class.

See the [CodePipeline documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-variables.html)
for more details on how to use the variables feature.

### Pipeline-level variables

You can add one or more variables at the pipeline level. You can reference
this value in the configuration of CodePipeline actions. You can add the
variable names, default values, and descriptions when you create the pipeline.
Variables are resolved at the time of execution.

Note that using pipeline-level variables in any kind of Source action is not supported.
Also, the variables can only be used with pipeline type V2.

```ts
declare const sourceAction: codepipeline_actions.S3SourceAction;
declare const sourceOutput: codepipeline.Artifact;
declare const deployBucket: s3.Bucket;

// Pipeline-level variable
const variable = new codepipeline.Variable({
  variableName: 'bucket-var',
  description: 'description',
  defaultValue: 'sample',
});

new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  variables: [variable],
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.S3DeployAction({
          actionName: 'DeployAction',
          // can reference the variables
          objectKey: `${variable.reference()}.txt`,
          input: sourceOutput,
          bucket: deployBucket,
        }),
      ],
    },
  ],
});
```

Or append a variable to an existing pipeline:

```ts
declare const pipeline: codepipeline.Pipeline;

const variable = new codepipeline.Variable({
  variableName: 'bucket-var',
  description: 'description',
  defaultValue: 'sample',
});
pipeline.addVariable(variable);
```

## Events

### Using a pipeline as an event target

A pipeline can be used as a target for a CloudWatch event rule:

```ts
// A pipeline being used as a target for a CloudWatch event rule.
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as events from 'aws-cdk-lib/aws-events';

// kick off the pipeline every day
const rule = new events.Rule(this, 'Daily', {
  schedule: events.Schedule.rate(Duration.days(1)),
});

declare const pipeline: codepipeline.Pipeline;
rule.addTarget(new targets.CodePipeline(pipeline));
```

When a pipeline is used as an event target, the
"codepipeline:StartPipelineExecution" permission is granted to the AWS
CloudWatch Events service.

### Event sources

Pipelines emit CloudWatch events. To define event rules for events emitted by
the pipeline, stages or action, use the `onXxx` methods on the respective
construct:

```ts
// Define event rules for events emitted by the pipeline
import * as events from 'aws-cdk-lib/aws-events';

declare const myPipeline: codepipeline.Pipeline;
declare const myStage: codepipeline.IStage;
declare const myAction: codepipeline.Action;
declare const target: events.IRuleTarget;
myPipeline.onStateChange('MyPipelineStateChange', { target: target } );
myStage.onStateChange('MyStageStateChange', target);
myAction.onStateChange('MyActionStateChange', target);
```

## CodeStar Notifications

To define CodeStar Notification rules for Pipelines, use one of the `notifyOnXxx()` methods.
They are very similar to `onXxx()` methods for CloudWatch events:

```ts
// Define CodeStar Notification rules for Pipelines
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
const target = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
  slackChannelConfigurationName: 'YOUR_CHANNEL_NAME',
  slackWorkspaceId: 'YOUR_SLACK_WORKSPACE_ID',
  slackChannelId: 'YOUR_SLACK_CHANNEL_ID',
});

declare const pipeline: codepipeline.Pipeline;
const rule = pipeline.notifyOnExecutionStateChange('NotifyOnExecutionStateChange', target);
```

## Trigger

To trigger a pipeline with Git tags or branches, specify the `triggers` property.
The triggers can only be used with pipeline type V2.

### Push filter

Pipelines can be started based on push events. You can specify the `pushFilter` property to
filter the push events. The `pushFilter` can specify Git tags.

In the case of Git tags, your pipeline starts when a Git tag is pushed.
You can filter with glob patterns. The `tagsExcludes` takes priority over the `tagsIncludes`.

```ts
declare const sourceAction: codepipeline_actions.CodeStarConnectionsSourceAction;
declare const buildAction: codepipeline_actions.CodeBuildAction;

new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction,
      pushFilter: [{
        tagsExcludes: ['exclude1', 'exclude2'],
        tagsIncludes: ['include*'],
      }],
    },
  }],
});
```

### Pull request filter

Pipelines can be started based on pull request events. You can specify the `pullRequestFilter` property to
filter the pull request events. The `pullRequestFilter` can specify branches, file paths, and event types.

In the case of branches, your pipeline starts when a pull request event occurs on the specified branches.
You can filter with glob patterns. The `branchesExcludes` takes priority over the `branchesIncludes`.

```ts
declare const sourceAction: codepipeline_actions.CodeStarConnectionsSourceAction;
declare const buildAction: codepipeline_actions.CodeBuildAction;

new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction,
      pullRequestFilter: [{
        branchesExcludes: ['exclude1', 'exclude2'],
        branchesIncludes: ['include*'],
      }],
    },
  }],
});
```

File paths can also be specified along with the branches to start the pipeline.
You can filter with glob patterns. The `filePathsExcludes` takes priority over the `filePathsIncludes`.

```ts
declare const sourceAction: codepipeline_actions.CodeStarConnectionsSourceAction;
declare const buildAction: codepipeline_actions.CodeBuildAction;

new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction,
      pullRequestFilter: [{
        branchesExcludes: ['exclude1', 'exclude2'],
        branchesIncludes: ['include1', 'include2'],
        filePathsExcludes: ['/path/to/exclude1', '/path/to/exclude2'],
        filePathsIncludes: ['/path/to/include1', '/path/to/include1'],
      }],
    },
  }],
});
```

To filter types of pull request events for triggers, you can specify the `events` property.

```ts
declare const sourceAction: codepipeline_actions.CodeStarConnectionsSourceAction;
declare const buildAction: codepipeline_actions.CodeBuildAction;

new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
  triggers: [{
    providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
    gitConfiguration: {
      sourceAction,
      pullRequestFilter: [{
        branchesExcludes: ['exclude1', 'exclude2'],
        branchesIncludes: ['include1', 'include2'],
        events: [
          codepipeline.GitPullRequestEvent.OPEN,
          codepipeline.GitPullRequestEvent.CLOSED,
        ],
      }],
    },
  }],
});
```

### Append a trigger to an existing pipeline

You can append a trigger to an existing pipeline:

```ts
declare const pipeline: codepipeline.Pipeline;
declare const sourceAction: codepipeline_actions.CodeStarConnectionsSourceAction;

pipeline.addTrigger({
  providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
  gitConfiguration: {
    sourceAction,
    pushFilter: [{
      tagsExcludes: ['exclude1', 'exclude2'],
      tagsIncludes: ['include*'],
    }],
  },
});
```

## Execution mode

To control the concurrency behavior when multiple executions of a pipeline are started, you can use the `executionMode` property.

The execution mode can only be used with pipeline type V2.

```ts
new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  executionMode: codepipeline.ExecutionMode.PARALLEL,
});
```

## Migrating a pipeline type from V1 to V2

To migrate your pipeline type from V1 to V2, you just need to update the `pipelineType` property to `PipelineType.V2`.
This migration does not cause replacement of your pipeline.

When the `@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2` feature flag is set to `true` (default for new projects),
the V2 type is selected by default if you do not specify a value for `pipelineType` property. Otherwise, the V1 type is selected.

```ts
new codepipeline.Pipeline(this, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2, // here
});
```

See the [CodePipeline documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipeline-types-planning.html)
for more details on the differences between each type.
