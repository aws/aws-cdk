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
