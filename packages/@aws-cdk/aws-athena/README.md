# Amazon Athena Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon Athena is an interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. Athena is serverless, so there is no infrastructure to manage, and you pay only for the queries that you run.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## WorkGroup

Workgroup helps to separate query executions, query history and set limits on amounts of data usage for Users, Teams, or Applications running under the same AWS account. 

```ts
import * as athena from '@aws-cdk/aws-athena';
import * as s3 from '@aws-cdk/aws-s3';

const workgroup = new athena.WorkGroup(this, 'Workgroup', {
      workGroupName: 'example-workgroup',
      description: 'An example workgroup',
      configuration: {
        resultConfigurations: {
          encryptionConfiguration: {
            encryptionOption: athena.EncryptionOption.S3_MANAGED,
          },
          outputLocation: {
            bucket: new s3.Bucket(this, 'Bucket'),
          },
        },
      },
    });
```
