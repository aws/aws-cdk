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

const repo = new codecommit.Repository(this, 'Repository' ,{
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
