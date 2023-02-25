# AWS::CodeStar Construct Library


## GitHub Repository

To create a new GitHub Repository and commit the assets from S3 bucket into the repository after it is created:

```ts
import * as codestar from 'aws-cdk-lib/aws-codestar';
import * as s3 from 'aws-cdk-lib/aws-s3'

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
