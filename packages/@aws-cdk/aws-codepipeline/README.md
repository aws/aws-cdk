## AWS CodePipeline Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

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
    justAfter: anotherStage,
    atIndex: 3, // indexing starts at 0
                // pipeline.stageCount returns the number of Stages currently in the Pipeline
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

```ts
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  // ...
  crossRegionReplicationBuckets: {
    'us-west-1': 'my-us-west-1-replication-bucket',
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

If you don't provide a bucket name for a region (other than the Pipeline's region)
that you're using for an Action with the `crossRegionReplicationBuckets` property,
there will be a new Stack, named `aws-cdk-codepipeline-cross-region-scaffolding-<region>`,
defined for you, containing a replication Bucket.
Note that you have to make sure to `cdk deploy` all of these automatically created Stacks
before you can deploy your main Stack (the one containing your Pipeline).
Use the `cdk ls` command to see all of the Stacks comprising your CDK application.
Example:

```bash
$ cdk ls
MyMainStack
aws-cdk-codepipeline-cross-region-scaffolding-us-west-1
$ cdk deploy aws-cdk-codepipeline-cross-region-scaffolding-us-west-1
# output of cdk deploy here...
$ cdk deploy MyMainStack
```

See [the AWS docs here](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-cross-region.html)
for more information on cross-region CodePipelines.

### Events

#### Using a pipeline as an event target

A pipeline can be used as a target for a CloudWatch event rule:

```ts
// kick off the pipeline every day
const rule = new EventRule(this, 'Daily', { scheduleExpression: 'rate(1 day)' });
rule.addTarget(pipeline);
```

When a pipeline is used as an event target, the
"codepipeline:StartPipelineExecution" permission is granted to the AWS
CloudWatch Events service.

#### Event sources

Pipelines emit CloudWatch events. To define event rules for events emitted by
the pipeline, stages or action, use the `onXxx` methods on the respective
construct:

```ts
myPipeline.onStateChange('MyPipelineStateChage', target);
myStage.onStateChange('MyStageStateChange', target);
myAction.onStateChange('MyActioStateChange', target);
```
