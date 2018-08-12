## AWS CodeBuild Construct Library

Define a project. This will also create an IAM Role and IAM Policy for CodeBuildRole to use.

Create a CodeBuild project with CodePipeline as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');

new codebuild.Project(this, 'MyFirstProject', {
    source: new codebuild.CodePipelineSource()
});
```

Create a CodeBuild project with CodeCommit as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'MyRepo', { repositoryName: 'foo' });
new codebuild.Project(this, 'MyFirstCodeCommitProject', {
    source: new codebuild.CodeCommitSource(repo)
});
```

Create a CodeBuild project with an S3 bucket as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');

const bucket = new s3.Bucket(this, 'MyBucket');
new codebuild.Project(this, 'MyProject', {
    source: new codebuild.S3BucketSource(bucket, 'path/to/source.zip')
});
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
