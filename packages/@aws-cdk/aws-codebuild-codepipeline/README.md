## AWS CodePipline Actions for AWS CodeBuild

This module contains an Action that allows you to use a CodeBuild Project in CodePipeline.

Example:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codebuildPipeline = require('@aws-cdk/aws-codebuild-codepipeline');
import codepipeline = require('@aws-cdk/aws-codepipeline');

// see the @aws-cdk/aws-codebuild module for more documentation on how to create CodeBuild Projects
const project = new codebuild.BuildProject( // ...
);

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const buildStage = new codepipeline.Stage(pipeline, 'Build');
new codebuildPipeline.PipelineBuildAction(buildStage, 'CodeBuild', {
    project: project,
});
```
