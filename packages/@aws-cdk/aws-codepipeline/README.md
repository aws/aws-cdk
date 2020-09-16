## AWS CodePipeline Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

### Pipeline

To construct an empty Pipeline:

```ts
import * as codepipeline from '@aws-cdk/aws-codepipeline';

const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline');
```

To give the Pipeline a nice, human-readable name:

```ts
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
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  crossAccountKeys: false,
});
```

### Stages

You can provide Stages when creating the Pipeline:

```typescript
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
const sourceStage = pipeline.addStage({
  stageName: 'Source',
  actions: [ // optional property
    // see below...
  ],
});
```

You can insert the new Stage at an arbitrary point in the Pipeline:

```ts
const someStage = pipeline.addStage({
  stageName: 'SomeStage',
  placement: {
    // note: you can only specify one of the below properties
    rightBefore: anotherStage,
    justAfter: anotherStage
  }
});
```

### Actions

Actions live in a separate package, `@aws-cdk/aws-codepipeline-actions`.

To add an Action to a Stage, you can provide it when creating the Stage,
in the `actions` property,
or you can use the `IStage.addAction()` method to mutate an existing Stage:

```ts
sourceStage.addAction(someAction);
```

### Cross-account CodePipelines

Cross-account Pipeline actions require that the Pipeline has *not* been
created with `crossAccountKeys: false`.

To perform actions in a different account than your Pipeline is in, most
actions accept a resource that is in a different account (either created
or imported):

```typescript
stage.addAction(new codepipeline_actions.S3DeployAction({
  bucket: s3.Bucket.fromBucketAttributes(this, 'Bucket', {
    account: '123456789012',
    // ...
  }),
  // ...
}));
```

Some actions accept an explicit `account` parameter:

```typescript
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  account: '123456789012',
  // ...
}));
```

CodePipeline requires that an IAM Role exists in the target account with a
well-known name. The `Pipeline` construct automatically defines a **support
stack** for you, named `<PipelineStackName>-support-<account>`, that will
provision a role that the pipeline will assume in the given account before
executing this action. This support stack will automatically be deployed
before the stack containing the pipeline.

You can also explicitly pass a `role` when creating the action. In that case,
the `account` property is ignored, and the action will operate in the same
account the role belongs to:

```ts
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  // ...
  role: iam.Role.fromRoleArn(this, 'ActionRole', '...'),
}));
```

### Cross-region CodePipelines

To perform actions in a different region than your Pipeline is in, most
actions accept a resource that is in a different region (either created
or imported):

```typescript
stage.addAction(new codepipeline_actions.S3DeployAction({
  bucket: s3.Bucket.fromBucketAttributes(this, 'Bucket', {
    region: 'us-west-1',
    // ...
  }),
  // ...
}));
```

Some actions accept an explicit `region` parameter:

```typescript
stage.addAction(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  // ...
  region: 'us-west-1',
}));
```

CodePipeline requires that a replication bucket exists in the region(s) you
want to deploy to. The `Pipeline` construct automatically defines a **support
stack** for you, named `<nameOfYourPipelineStack>-support-<region>`, which
contains this replication bucket. This support stack will automatically be
deployed before the stack containing the pipeline.

If you don't want to use these support stacks, and already have buckets in
place to serve as replication buckets, you can supply these at Pipeline definition
time using the `crossRegionReplicationBuckets` parameter. Example:

```ts
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', { /* ... */ });
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

#### Creating an encrypted replication bucket

If you're passing a replication bucket created in a different stack,
like this:

```typescript
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
new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
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

```typescript
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

### Variables

The library supports the CodePipeline Variables feature.
Each action class that emits variables has a separate variables interface,
accessed as a property of the action instance called `variables`.
You instantiate the action class and assign it to a local variable;
when you want to use a variable in the configuration of a different action,
you access the appropriate property of the interface returned from `variables`,
which represents a single variable.
Example:

```typescript
// MyAction is some action type that produces variables
const myAction = new MyAction({
  // ...
});
new OtherAction({
  // ...
  config: myAction.variables.myVariable,
});
```

The namespace name that will be used will be automatically generated by the pipeline construct,
based on the stage and action name;
you can pass a custom name when creating the action instance:

```typescript
const myAction = new MyAction({
  // ...
  variablesNamespace: 'MyNamespace',
});
```

There are also global variables available,
not tied to any action;
these are accessed through static properties of the `GlobalVariables` class:

```typescript
new OtherAction({
  // ...
  config: codepipeline.GlobalVariables.executionId,
});
```

Check the documentation of the `@aws-cdk/aws-codepipeline-actions`
for details on how to use the variables for each action class.

See the [CodePipeline documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-variables.html)
for more details on how to use the variables feature.

### Events

#### Using a pipeline as an event target

A pipeline can be used as a target for a CloudWatch event rule:

```ts
import * as targets from '@aws-cdk/aws-events-targets';
import * as events from '@aws-cdk/aws-events';

// kick off the pipeline every day
const rule = new events.Rule(this, 'Daily', {
  schedule: events.Schedule.rate(Duration.days(1)),
});

rule.addTarget(new targets.CodePipeline(pipeline));
```

When a pipeline is used as an event target, the
"codepipeline:StartPipelineExecution" permission is granted to the AWS
CloudWatch Events service.

#### Event sources

Pipelines emit CloudWatch events. To define event rules for events emitted by
the pipeline, stages or action, use the `onXxx` methods on the respective
construct:

```ts
myPipeline.onStateChange('MyPipelineStateChange', target);
myStage.onStateChange('MyStageStateChange', target);
myAction.onStateChange('MyActionStateChange', target);
```
