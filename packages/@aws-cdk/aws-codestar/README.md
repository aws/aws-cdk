## AWS::CodeStar Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.


## Github Repository

To create a new Github Repository and commit the assets from S3 bucket into the repository after it is created

```ts
new GithubRepository(stack, 'GithubRepo', {
  owner: 'foo',
  name: 'bar',
  accessToken: cdk.SecretValue.secretsManager('my-github-token', {
    jsonField: 'token',
  }),
  bucket: Bucket.fromBucketName(stack, 'Bucket', 'bucket-name'),
  key: 'import.zip',
});
```
