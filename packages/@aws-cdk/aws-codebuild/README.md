## AWS CodeBuild Construct Library

Define a project. This will also create an IAM Role and IAM Policy for CodeBuild to use.

### Using CodeBuild with other AWS services

#### CodeCommit

Create a CodeBuild project with CodeCommit as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'MyRepo', { repositoryName: 'foo' });
new codebuild.Project(this, 'MyFirstCodeCommitProject', {
    source: new codebuild.CodeCommitSource(repo)
});
```

#### S3

Create a CodeBuild project with an S3 bucket as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');

const bucket = new s3.Bucket(this, 'MyBucket');
new codebuild.Project(this, 'MyProject', {
    source: new codebuild.S3BucketSource(bucket, 'path/to/source.zip')
});
```

#### CodePipeline

Example of a Project used in CodePipeline,
alongside CodeCommit:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');

const repository = new codecommit.Repository(this, 'MyRepository', {
    repositoryName: 'MyRepository',
});

const project = new codebuild.PipelineProject(this, 'MyProject');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');

const sourceStage = new codepipeline.Stage(this, 'Source', {
    pipeline,
});
const sourceAction = new codecommit.PipelineSource(this, 'CodeCommit', {
    stage: sourceStage,
    artifactName: 'SourceOutput',
    repository,
});

const buildStage = new codepipeline.Stage(this, 'Build', {
    pipeline,
});
new codebuild.PipelineBuildAction(this, 'CodeBuild', {
    stage: buildStage,
    inputArtifact: sourceAction.artifact,
    project,
});
```

The `PipelineProject` utility class is a simple sugar around the `Project` class,
it's equivalent to:

```ts
const project = new codebuild.Project(this, 'MyProject', {
    source: new codebuild.CodePipelineSource(),
    artifacts: new codebuild.CodePipelineBuildArtifacts(),
    // rest of the properties from PipelineProject are passed unchanged...
}
```

You can also add the Project to the Pipeline directly:

```ts
// equivalent to the code above:
project.addBuildToPipeline(buildStage, 'CodeBuild', {
    inputArtifact: sourceAction.artifact,
})
```

### Using Project as an event target

The `Project` construct implements the `IEventRuleTarget` interface. This means that it can be
used as a target for event rules:

```ts
// start build when a commit is pushed
codeCommitRepository.onCommit('OnCommit', project);
```

### Using Project as an event source

To define CloudWatch event rules for build projects, use one of the `onXxx` methods:

```ts
const rule = project.onStateChange('BuildStateChange');
rule.addTarget(lambdaFunction);
```
