## AWS CodePipline Actions for AWS CodeCommit

This module contains an Action that allows you to use a CodeCommit Repository as a Source in CodePipeline.

Example:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');
import codecommitPipeline = require('@aws-cdk/aws-codecommit-codepipeline');
import codepipeline = require('@aws-cdk/aws-codepipeline');

// see the @aws-cdk/aws-codecommit module for more documentation on how to create CodeCommit Repositories
const repository = new codecommit.Repository( // ...
);

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceStage = new codepipeline.Stage(pipeline, 'Source');
new codecommitPipeline.SourceAction(sourceStage, 'CodeCommit', {
    repository: repository,
});
```
