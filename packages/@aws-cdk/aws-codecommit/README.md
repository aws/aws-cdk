# AWS CodeCommit Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

AWS CodeCommit is a version control service that enables you to privately store and manage Git repositories in the AWS cloud.

For further information on CodeCommit,
see the [AWS CodeCommit documentation](https://docs.aws.amazon.com/codecommit).

To add a CodeCommit Repository to your stack:

```ts
import * as codecommit from '@aws-cdk/aws-codecommit';

const repo = new codecommit.Repository(this, 'Repository', {
    repositoryName: 'MyRepositoryName',
    description: 'Some description.', // optional property
});
```

Use the `repositoryCloneUrlHttp`, `repositoryCloneUrlSsh` or `repositoryCloneUrlGrc`
property to clone your repository.

To add an Amazon SNS trigger to your repository:

```ts
// trigger is established for all repository actions on all branches by default.
repo.notify('arn:aws:sns:*:123456789012:my_topic');
```

## Initialize with Code

It is possible to initialize the Repository with an Asset.
For learning how assets work, see the CDK Assets documentation.
Be aware, that this will only work on *directories*, not on single files.
This is due to the fact, that CodeCommit expects a zip in the S3 Bucket.

Example:

```ts
const readmeAsset = new assets.Asset(this, 'ReadmeAsset', {
      path: path.join(__dirname, 'directory/'),
});

const repo = new Repository(this, 'Repository', {
    repositoryName: 'MyRepositoryName',
    description: 'Some description.', // optional property
    code: { // optional property
        branchName: 'main', // optional, defaults to main
        asset: readmeAsset,
    },
});
```

## Events

CodeCommit repositories emit Amazon CloudWatch events for certain activities.
Use the `repo.onXxx` methods to define rules that trigger on these events
and invoke targets as a result:

```ts
// starts a CodeBuild project when a commit is pushed to the "master" branch of the repo
repo.onCommit('CommitToMaster', {
    target: new targets.CodeBuildProject(project),
    branches: ['master'],
});

// publishes a message to an Amazon SNS topic when a comment is made on a pull request
const rule = repo.onCommentOnPullRequest('CommentOnPullRequest', {
    target: new targets.SnsTopic(myTopic),
});
```

## CodeStar Notifications

To define CodeStar Notification rules for Repositories, use one of the `notifyOnXxx()` methods.
They are very similar to `onXxx()` methods for CloudWatch events:

```ts
const target = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
  slackChannelConfigurationName: 'YOUR_CHANNEL_NAME',
  slackWorkspaceId: 'YOUR_SLACK_WORKSPACE_ID',
  slackChannelId: 'YOUR_SLACK_CHANNEL_ID',
});
const rule = repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);
