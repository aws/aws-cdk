## AWS CodePipline Actions for AWS CodeBuild

This module contains an Action that allows you to use a CodeBuild Project in CodePipeline.

Example:

```ts
import codebuildPipeline = require('@aws-cdk/aws-codebuild-codepipeline');
import codepipeline = require('@aws-cdk/aws-codepipeline');

// see the @aws-cdk/aws-codebuild module for more documentation on how to create CodeBuild Projects
const project = new codebuildPipeline.PipelineProject(this, 'MyProject', {
    // ...
});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const buildStage = new codepipeline.Stage(pipeline, 'Build');
new codebuildPipeline.PipelineBuildAction(buildStage, 'CodeBuild', {
    project
});
```

The `PipelineProject` utility class is a simple sugar around the `Project`
class from the `@aws-cdk/aws-codebuild` module,
it's equivalent to:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');

const project = new codebuild.Project(this, 'MyProject', {
    source: new codebuild.CodePipelineSource(),
    artifacts: new codebuild.CodePipelineBuildArtifacts(),
    // rest of the properties from PipelineProject are passed unchanged...
}
```
