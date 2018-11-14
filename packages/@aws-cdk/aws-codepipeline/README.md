## AWS CodePipeline Construct Library

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

To append a Stage to a Pipeline:

```ts
const sourceStage = pipeline.addStage('Source');
```

You can also instantiate the `Stage` Construct directly,
which will add it to the Pipeline provided in its construction properties.

You can insert the new Stage at an arbitrary point in the Pipeline:

```ts
const sourceStage = pipeline.addStage('Source', {
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

To add an Action to a Stage:

```ts
new codepipeline.GitHubSourceAction(this, 'GitHub_Source', {
  stage: sourceStage,
  owner: 'awslabs',
  repo: 'aws-cdk',
  branch: 'develop', // default: 'master'
  oauthToken: ...,
})
```

The Pipeline construct will automatically generate and wire together the artifact names CodePipeline uses.
If you need, you can also name the artifacts explicitly:

```ts
const sourceAction = new codepipeline.GitHubSourceAction(this, 'GitHub_Source', {
  // other properties as above...
  outputArtifactName: 'SourceOutput', // this will be the name of the output artifact in the Pipeline
});

// in a build Action later...

new codepipeline.JenkinsBuildAction(this, 'Jenkins_Build', {
  // other properties...
  inputArtifact: sourceAction.outputArtifact,
});
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
new cloudformation.PipelineCreateUpdateStackAction(this, 'CFN_US_West_1', {
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
