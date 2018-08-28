## AWS CodePipeline construct library

Construct an empty Pipeline:

```ts
const pipeline = new Pipeline(this, 'MyFirstPipeline', {
    pipelineName: 'MyFirstPipeline',
});
```

Append a Stage to the Pipeline:

```ts
const sourceStage = new Stage(this, 'Source', {
    pipeline,
});
```

Add an Action to a Stage:

```ts
new codecommit.PipelineSource(this, 'Source', {
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
