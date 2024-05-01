# AWS CodeCommit Construct Library


AWS CodeCommit is a version control service that enables you to privately store and manage Git repositories in the AWS cloud.

For further information on CodeCommit,
see the [AWS CodeCommit documentation](https://docs.aws.amazon.com/codecommit).

To add a CodeCommit Repository to your stack:

```ts
const repo = new codecommit.Repository(this, 'Repository', {
  repositoryName: 'MyRepositoryName',
  description: 'Some description.', // optional property
});
```

Use the `repositoryCloneUrlHttp`, `repositoryCloneUrlSsh` or `repositoryCloneUrlGrc`
property to clone your repository.

To add an Amazon SNS trigger to your repository:

```ts
declare const repo: codecommit.Repository;

// trigger is established for all repository actions on all branches by default.
repo.notify('arn:aws:sns:*:123456789012:my_topic');
```

## Add initial commit

It is possible to initialize the Repository via the `Code` class.
It provides methods for loading code from a directory, `.zip` file and from a pre-created CDK Asset.

Example:

```ts
const repo = new codecommit.Repository(this, 'Repository', {
  repositoryName: 'MyRepositoryName',
  code: codecommit.Code.fromDirectory(path.join(__dirname, 'directory/'), 'develop'), // optional property, branch parameter can be omitted
});
```

## Use a customer managed key

CodeCommit repositories are automatically encrypted with an AWS managed key. To use
a customer managed key, specify the `kmsKey` property.

For more information, see
[AWS Key Management Service and encryption for AWS CodeCommit repositories](https://docs.aws.amazon.com/cdk/latest/guide/reference.html#versioning).

```ts
import * as kms from 'aws-cdk-lib/aws-kms';

declare const kmsKey: kms.IKey;

const repo = new codecommit.Repository(this, 'Repository', {
  repositoryName: 'MyRepositoryName',
  kmsKey,
});
```

## Events

CodeCommit repositories emit Amazon CloudWatch events for certain activities.
Use the `repo.onXxx` methods to define rules that trigger on these events
and invoke targets as a result:

```ts
import * as sns from 'aws-cdk-lib/aws-sns';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const repo: codecommit.Repository;
declare const project: codebuild.PipelineProject;
declare const myTopic: sns.Topic;

// starts a CodeBuild project when a commit is pushed to the "main" branch of the repo
repo.onCommit('CommitToMain', {
  target: new targets.CodeBuildProject(project),
  branches: ['main'],
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
import * as chatbot from 'aws-cdk-lib/aws-chatbot';

declare const repository: codecommit.Repository;
const target = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
  slackChannelConfigurationName: 'YOUR_CHANNEL_NAME',
  slackWorkspaceId: 'YOUR_SLACK_WORKSPACE_ID',
  slackChannelId: 'YOUR_SLACK_CHANNEL_ID',
});
const rule = repository.notifyOnPullRequestCreated('NotifyOnPullRequestCreated', target);
```
