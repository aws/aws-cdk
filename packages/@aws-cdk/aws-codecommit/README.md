# AWS CodeCommit

AWS CodeCommit is a version control service that enables you to privately store and manage Git repositories in the AWS cloud.

For further information on CodeCommit,
see the [AWS CodeCommit documentation](https://docs.aws.amazon.com/codecommit).

To add a CodeCommit Repository to your stack:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'Repository' ,{
    repositoryName: 'MyRepositoryName',
    description: 'Some description.', // optional property
});
```

To add an Amazon SNS trigger to your repository:

```ts
// trigger is established for all repository actions on all branches by default.
repo.notify('arn:aws:sns:*:123456789012:my_topic');
```

## AWS CodePipeline

To use a CodeCommit Repository in a CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
  pipelineName: 'MyPipeline',
});
const sourceAction = new codecommit.PipelineSourceAction({
  actionName: 'CodeCommit',
  repository: repo,
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});
```

You can also create the action from the Repository directly:

```ts
// equivalent to the code above:
const sourceAction = repo.toCodePipelineSourceAction({ actionName: 'CodeCommit' });
```

## Events

CodeCommit repositories emit Amazon CloudWatch events for certain activities.
Use the `repo.onXxx` methods to define rules that trigger on these events
and invoke targets as a result:

```ts
// starts a CodeBuild project when a commit is pushed to the "master" branch of the repo
repo.onCommit('CommitToMaster', project, 'master');

// publishes a message to an Amazon SNS topic when a comment is made on a pull request
const rule = repo.onCommentOnPullRequest('CommentOnPullRequest');
rule.addTarget(myTopic);
```
