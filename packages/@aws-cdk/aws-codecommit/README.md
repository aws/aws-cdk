## AWS CodeCommit Construct Library

To add a CodeCommit Repository to your stack:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'Repository' ,{
    repositoryName: 'MyRepositoryName',
    description: 'Some description.', // optional property
});
```

To add an SNS trigger to your repository:

```ts
// trigger is established for all repository actions on all branches by default.
repo.notify('arn:aws:sns:*:123456789012:my_topic');
```

### CodePipeline

To use a CodeCommit Repository in a CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
    pipelineName: 'MyPipeline',
});
const sourceStage = pipeline.addStage('Source');
const sourceAction = new codecommit.PipelineSourceAction(this, 'CodeCommit', {
    stage: sourceStage,
    repository: repo,
    outputArtifactName: 'SourceOutput', // optional - by default, a name will be auto-generated
});
// use `sourceAction.outputArtifact` as the `inputArtifact` to later Actions...
```

You can also add the Repository to the Pipeline directly:

```ts
// equivalent to the code above:
const sourceAction = repo.addToPipeline(sourceStage, 'CodeCommit');
```

### Events

CodeCommit repositories emit CloudWatch events for certain activity.
Use the `repo.onXxx` methods to define rules that trigger on these events
and invoke targets as a result:

```ts
// starts a CodeBuild project when a commit is pushed to the "master" branch of the repo
repo.onCommit('CommitToMaster', project, 'master');

// publishes a message to an SNS topic when a comment is made on a pull request
const rule = repo.onCommentOnPullRequest('CommentOnPullRequest');
rule.addTarget(myTopic);
```
