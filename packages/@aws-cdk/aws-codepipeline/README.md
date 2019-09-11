## AWS CodePipeline Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

### Pipeline

To construct an empty Pipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline');
```

To give the Pipeline a nice, human-readable name:

```ts
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  pipelineName: 'MyPipeline',
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

### Cross-region CodePipelines

You can also use the cross-region feature to deploy resources
(currently, only CloudFormation Stacks are supported)
into a different region than your Pipeline is in.

It works like this:

```typescript
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

// later in the code...
new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  actionName: 'CFN_US_West_1',
  // ...
  region: 'us-west-1',
});
```

This way, the `CFN_US_West_1` Action will operate in the `us-west-1` region,
regardless of which region your Pipeline is in.

If you don't provide a bucket for a region (other than the Pipeline's region)
that you're using for an Action,
there will be a new Stack, called `<nameOfYourPipelineStack>-support-<region>`,
defined for you, containing a replication Bucket.
This new Stack will depend on your Pipeline Stack,
so deploying the Pipeline Stack will deploy the support Stack(s) first.
Example:

```bash
$ cdk ls
MyMainStack
MyMainStack-support-us-west-1
$ cdk deploy MyMainStack
# output of cdk deploy here...
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

### Events

#### Using a pipeline as an event target

A pipeline can be used as a target for a CloudWatch event rule:

```ts
import targets = require('@aws-cdk/aws-events-targets');
import events = require('@aws-cdk/aws-events');

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
