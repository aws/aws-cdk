## AWS CodePipeline construct library

Construct an empty pipeline:

```ts
const pipeline = new Pipeline(this, 'MyFirstPipeline');
```

All of the components of a pipeline are modeled as constructs.

Append a stage to the pipeline:

```ts
const sourceStage = new Stage(pipeline, 'Source');
```

Add an action to a stage:

```ts
new codecommit.PipelineSource(sourceStage, 'source', {
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
