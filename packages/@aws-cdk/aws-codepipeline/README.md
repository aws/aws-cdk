## AWS CodePipeline construct library

Construct an empty Pipeline:

```ts
const pipeline = new Pipeline(this, 'MyFirstPipeline', {
    pipelineName: 'MyFirstPipeline',
});
```

Append a Stage to the Pipeline:

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

Add an Action to a Stage:

```ts
new codecommit.PipelineSourceAction(this, 'Source', {
    stage: sourceStage,
    artifactName: 'MyPackageSourceArtifact',
    repository: codecommit.RepositoryRef.import(this, 'MyExistingRepository', {
        repositoryName: new codecommit.RepositoryName('MyExistingRepository'),
    }),
})
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
