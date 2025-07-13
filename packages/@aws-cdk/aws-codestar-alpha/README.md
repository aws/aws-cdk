# AWS::CodeStar Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## GitHub Repository

To create a new GitHub Repository and commit the assets from S3 bucket into the repository after it is created:

```ts
import * as codestar from '@aws-cdk/aws-codestar-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3'

new codestar.GitHubRepository(this, 'GitHubRepo', {
  owner: 'aws',
  repositoryName: 'aws-cdk',
  accessToken: SecretValue.secretsManager('my-github-token', {
    jsonField: 'token',
  }),
  contentsBucket: s3.Bucket.fromBucketName(this, 'Bucket', 'amzn-s3-demo-bucket'),
  contentsKey: 'import.zip',
});
```

## Update or Delete the GitHubRepository

At this moment, updates to the `GitHubRepository` are not supported and the repository will not be deleted upon the deletion of the CloudFormation stack. You will need to update or delete the GitHub repository manually. 
