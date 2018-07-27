## AWS Actions for AWS Code Pipeline

This module contains all of the integrations for CodePipeline
with other AWS services.

Example usage:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipelineAwsActions = require('@aws-cdk/aws-codepipeline-aws-actions');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'Source');
new codepipelineAwsActions.codecommit.SourceAction(sourceStage, 'Source', {
    // ...
});

const buildStage = new codepipeline.Stage(pipeline, 'Build');
new codepipelineAwsActions.codebuild.BuildAction(buildStage, 'Build', {
    // ...
});
```
