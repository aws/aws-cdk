# AWS::CodeStar Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

## GitHub Repository

To create a new GitHub Repository and commit the assets from S3 bucket into the repository after it is created:

```ts
import * as codestar from '@aws-cdk/aws-codestar';
import * as s3 from '@aws-cdk/aws-s3'

new codestar.GitHubRepository(this, 'GitHubRepo', {
  owner: 'aws',
  repositoryName: 'aws-cdk',
  accessToken: SecretValue.secretsManager('my-github-token', {
    jsonField: 'token',
  }),
  contentsBucket: s3.Bucket.fromBucketName(this, 'Bucket', 'bucket-name'),
  contentsKey: 'import.zip',
});
```

## Update or Delete the GitHubRepository

At this moment, updates to the `GitHubRepository` are not supported and the repository will not be deleted upon the deletion of the CloudFormation stack. You will need to update or delete the GitHub repository manually. 
