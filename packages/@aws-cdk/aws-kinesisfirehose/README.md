# Amazon Kinesis Data Firehose Construct Library
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

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project. It allows you to create Kinesis Data Firehose delivery streams.

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as redshift from '@aws-cdk/aws-redshift';

// Given a Redshift cluster
const vpc = new ec2.Vpc(this, 'Vpc');
const database = 'my_db';
const cluster = new redshift.Cluster(this, 'Cluster', {
  vpc: vpc,
  masterUser: {
    masterUsername: 'master',
  },
  defaultDatabaseName: database,
});

// Create a delivery stream that publishes data to the cluster
new DeliveryStream(this, 'Delivery Stream', {
  destination: new RedshiftDestination({
    cluster: cluster,
    user: {
      username: 'firehose',
    },
    database: database,
    tableName: 'table',
  }),
});
```
