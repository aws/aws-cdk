## AWS CodeCommit Construct Library

To add a CodeCommit Repository to your stack:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');

const repository = new codecommit.Repository(stack, 'Repository' ,{
    repositoryName: 'MyRepositoryName'
});
```

To add an SNS trigger to your repository:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');

const repository = new codecommit.Repository(stack, 'Repository', {
    repositoryName: 'MyRepositoryName'
});

// trigger is established for all repository actions on all branches by default.
repository.notify('arn:aws:sns:*:123456789012:my_topic');
```

### Events

CodeCommit repositories emit CloudWatch events for certain activity. Use the
`repo.onXxx` methods to define rules that trigger on these events and invoke
targets as a result:

```ts
// starts a CodeBuild project when a commit is pushed to the "master" branch of the repo
repo.onCommit('CommitToMaster', buildProject, 'master');

// publishes a message to an SNS topic when a comment is made on a pull request
const rule = repo.onCommentOnPullRequest('CommentOnPullRequest');
rule.addTarget(myTopic);
```
