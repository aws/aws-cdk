## Amazon DynamoDB Accelerator Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

DAX is a DynamoDB-compatible caching service that enables you to benefit from fast in-memory performance for demanding applications.

### Installation

Import to your project:

```ts
import * as dax from '@aws-cdk/aws-dax';
```

### Basic usage

Here's how to setup a DAX cluster and give your compute role permissions to read from and write to the DAX Cluster:

```ts
const vpc = new Vpc(stack, 'MyVpc');
const securityGroup = new SecurityGroup(stack, 'MySecurityGroup', { vpc });
const table = new Table(stack, 'MyTable', {
  partitionKey: {
    name: 'PrimaryKey',
    type: AttributeType.STRING,
  },
});

const cluster = new Cluster(stack, 'MyCluster', {
  tables: [table],
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
});

const appRole = new Role(stack, 'MyApplicationRole', {
  assumedBy: new AccountRootPrincipal(),
});
cluster.grantReadWriteData(appRole);
```
