## AWS CodeBuild Construct Library

Define a project. This will also create an IAM Role and IAM Policy for CodeBuildRole to use.

Create a CodeBuild project with CodePipeline as the source:

```ts
new BuildProject(this, 'MyFirstProject', {
    source: new CodePipelineSource()
});
```

Create a CodeBuild project with CodeCommit as the source:

```ts
const repo = new Repository(this, 'MyRepo', { repositoryName: 'foo' });
new BuildProject(this, 'MyFirstCodeCommitProject', {
    source: new CodeCommitSource(repo)
});
```

Create a CodeBuild project with an S3 bucket as the source:

```ts
const bucket = new Bucket(this, 'MyBucket');
new BuildProject(this, 'MyProject', {
    source: new S3BucketSource(bucket, 'path/to/source.zip')
});
```

### Using BuildProject as an event target

The `BuildProject` construct implements the `IEventRuleTarget` interface. This means that it can be
used as a target for event rules:

```ts
// start build when a commit is pushed
codeCommitRepository.onCommit('OnCommit', buildProject);
```

### Using BuildProject as an event source

To define CloudWatch event rules for build projects, use one of the `onXxx` methods:

```ts
const rule = project.onStateChange('BuildStateChange');
rule.addTarget(lambda);
```
