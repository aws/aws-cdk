# Amazon DynamoDB Construct Library

Here is a minimal deployable DynamoDB table definition:

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
```

## Referencing existing tables

To reference an existing table in your CDK application, use the `Table.fromTableName`, `Table.fromTableArn` or `Table.fromTableAttributes`
factory method. This method accepts table name or table ARN which describes the properties of an already
existing table:

```ts
declare const user: iam.User;
const table = dynamodb.Table.fromTableArn(this, 'ImportedTable', 'arn:aws:dynamodb:us-east-1:111111111:table/my-table');
// now you can just call methods on the table
table.grantReadWriteData(user);
```

If you intend to use the `tableStreamArn` (including indirectly, for example by creating an
`aws-cdk-lib/aws-lambda-event-sources.DynamoEventSource` on the referenced table), you *must* use the
`Table.fromTableAttributes` method and the `tableStreamArn` property *must* be populated.

To grant permissions to indexes on a referenced table you can either set `grantIndexPermissions` to `true`, or you can provide the indexes via the `globalIndexes` or `localIndexes` properties. This will enable `grant*` methods to also grant permissions to *all* table indexes.

## Keys

When a table is defined, you must define it's schema using the `partitionKey`
(required) and `sortKey` (optional) properties.

## Billing Mode

DynamoDB supports two billing modes:

* PROVISIONED - the default mode where the table and global secondary indexes have configured read and write capacity.
* PAY_PER_REQUEST - on-demand pricing and scaling. You only pay for what you use and there is no read and write capacity for the table or its global secondary indexes.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});
```

You can specify a maximum read or write request units when using PAY_PER_REQUEST billing mode:

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  maxReadRequestUnits: 100,
  maxWriteRequestUnits: 200,
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.

## Warm Throughput
Warm throughput refers to the number of read and write operations your DynamoDB table can instantaneously support.

This optional configuration allows you to pre-warm your table or index to handle anticipated throughput, ensuring optimal performance under expected load.

Note: The Warm Throughput feature is not available for Global Table replicas using `Table` construct; use the `TableV2` construct instead to enable this functionality.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  warmThroughput: {
      readUnitsPerSecond: 15000,
      writeUnitsPerSecond: 20000,
    },
});
```
Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/warm-throughput.html

## Table Class

DynamoDB supports two table classes:

* STANDARD - the default mode, and is recommended for the vast majority of workloads.
* STANDARD_INFREQUENT_ACCESS - optimized for tables where storage is the dominant cost.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html

## Configure AutoScaling for your table

You can have DynamoDB automatically raise and lower the read and write capacities
of your table by setting up autoscaling. You can use this to either keep your
tables at a desired utilization level, or by scaling up and down at pre-configured
times of the day:

Auto-scaling is only relevant for tables with the billing mode, PROVISIONED.

[Example of configuring autoscaling](test/integ.autoscaling.lit.ts)

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html
https://aws.amazon.com/blogs/database/how-to-use-aws-cloudformation-to-configure-auto-scaling-for-amazon-dynamodb-tables-and-indexes/

## Amazon DynamoDB Global Tables

You can create DynamoDB Global Tables by setting the `replicationRegions` property on a `Table`:

```ts
const globalTable = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
});
```

When doing so, a CloudFormation Custom Resource will be added to the stack in order to create the replica tables in the
selected regions.

The default billing mode for Global Tables is `PAY_PER_REQUEST`.
If you want to use `PROVISIONED`,
you have to make sure write auto-scaling is enabled for that Table:

```ts
const globalTable = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
  billingMode: dynamodb.BillingMode.PROVISIONED,
});

globalTable.autoScaleWriteCapacity({
  minCapacity: 1,
  maxCapacity: 10,
}).scaleOnUtilization({ targetUtilizationPercent: 75 });
```

When adding a replica region for a large table, you might want to increase the
timeout for the replication operation:

```ts
const globalTable = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
  replicationTimeout: Duration.hours(2), // defaults to Duration.minutes(30)
});
```

A maximum of 10 tables with replication can be added to a stack without a limit increase for
[managed policies attached to an IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities).
This is because more than 10 managed policies will be attached to the DynamoDB service replication role - one policy per replication table.
Consider splitting your tables across multiple stacks if your reach this limit.

## Encryption

All user data stored in Amazon DynamoDB is fully encrypted at rest. When creating a new table, you can choose to encrypt using the following customer master keys (CMK) to encrypt your table:

* AWS owned CMK - By default, all tables are encrypted under an AWS owned customer master key (CMK) in the DynamoDB service account (no additional charges apply).
* AWS managed CMK - AWS KMS keys (one per region) are created in your account, managed, and used on your behalf by AWS DynamoDB (AWS KMS charges apply).
* Customer managed CMK - You have full control over the KMS key used to encrypt the DynamoDB Table (AWS KMS charges apply).

Creating a Table encrypted with a customer managed CMK:

```ts
const table = new dynamodb.Table(this, 'MyTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
});

// You can access the CMK that was added to the stack on your behalf by the Table construct via:
const tableEncryptionKey = table.encryptionKey;
```

You can also supply your own key:

```ts
import * as kms from 'aws-cdk-lib/aws-kms';

const encryptionKey = new kms.Key(this, 'Key', {
  enableKeyRotation: true,
});
const table = new dynamodb.Table(this, 'MyTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
  encryptionKey, // This will be exposed as table.encryptionKey
});
```

In order to use the AWS managed CMK instead, change the code to:

```ts
const table = new dynamodb.Table(this, 'MyTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryption.AWS_MANAGED,
});

// In this case, the CMK _cannot_ be accessed through table.encryptionKey.
```

## Get schema of table or secondary indexes

To get the partition key and sort key of the table or indexes you have configured:

```ts
declare const table: dynamodb.Table;

// For single keys, use schema() (deprecated for multi-attribute keys)
const schema = table.schema();
const partitionKey = schema.partitionKey;
const sortKey = schema.sortKey;

// For multi-attribute keys, use schemaV2() which returns normalized arrays
const schemaV2 = table.schemaV2();
const partitionKeys = schemaV2.partitionKeys; // Attribute[]
const sortKeys = schemaV2.sortKeys; // Attribute[]

// Get schema for a specific index
const indexSchema = table.schemaV2('INDEX_NAME');
```

Note: `schema()` is deprecated for indexes with multi-attribute keys and will throw an error. Use `schemaV2()` instead, which always returns normalized arrays.

## Global Secondary Indexes with multi-attribute Keys

Global secondary indexes support multi-attribute keys, allowing you to specify multiple partition keys and/or multiple sort keys. This enables more flexible query patterns for complex data models.

**Key Constraints:**
- You can specify up to **4 partition keys** per global secondary index
- You can specify up to **4 sort keys** per global secondary index
- Use **either** `partitionKey` (singular) **or** `partitionKeys` (plural), but not both
- Use **either** `sortKey` (singular) **or** `sortKeys` (plural), but not both
- At least one partition key must be specified (either `partitionKey` or `partitionKeys`)
- For multiple keys, you **must** use the plural parameters (`partitionKeys` and/or `sortKeys`)
- **Keys cannot be added or modified after index creation** - attempting to add additional keys to an existing index will result in an error

**Example:**

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
});

table.addGlobalSecondaryIndex({
  indexName: 'multi-attribute-gsi',
  partitionKeys: [
    { name: 'gsi_pk1', type: dynamodb.AttributeType.STRING },
    { name: 'gsi_pk2', type: dynamodb.AttributeType.NUMBER },
  ],
  sortKeys: [
    { name: 'gsi_sk1', type: dynamodb.AttributeType.STRING },
    { name: 'gsi_sk2', type: dynamodb.AttributeType.BINARY },
  ],
});
```

## Kinesis Stream

A Kinesis Data Stream can be configured on the DynamoDB table to capture item-level changes.

You can optionally configure the `kinesisPrecisionTimestamp` parameter to specify the precision level of the approximate creation date and time. The allowed values are `MICROSECOND` and `MILLISECOND`. If this parameter is not specified, the default precision is set to `MICROSECOND`.

```ts
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const stream = new kinesis.Stream(this, 'Stream');

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  kinesisStream: stream,
});
```

## Alarm metrics

Alarms can be configured on the DynamoDB table to captured metric data

```ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});

const metric = table.metricThrottledRequestsForOperations({
  operations: [dynamodb.Operation.PUT_ITEM],
  period: Duration.minutes(1),
});

new cloudwatch.Alarm(this, 'Alarm', {
  metric: metric,
  evaluationPeriods: 1,
  threshold: 1,
});
```

## Deletion Protection for Tables

You can enable deletion protection for a table by setting the `deletionProtection` property to `true`.
When deletion protection is enabled for a table, it cannot be deleted by anyone. By default, deletion protection is disabled.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  deletionProtection: true,
});
```
## Resource Policy

Using `resourcePolicy` you can add a [resource policy](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-resource-based.html) to a table in the form of a `PolicyDocument`:

```ts
const policy = new iam.PolicyDocument({
  statements: [
    new iam.PolicyStatement({
      actions: ['dynamodb:GetItem'],
      principals: [new iam.AccountRootPrincipal()],
      resources: ['*'],
    }),
  ],
});

new dynamodb.Table(this, 'MyTable', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
  resourcePolicy: policy,
});
```

If you have a global table replica, note that it does not support the addition of a resource-based policy.

## Point-in-Time Recovery

`pointInTimeRecoverySpecifcation` provides automatic backups of your DynamoDB table data which helps protect your tables from accidental write or delete operations.

You can also choose to set `recoveryPeriodInDays` to a value between `1` and `35` which dictates how many days of recoverable data is stored. If no value is provided, the recovery period defaults to `35` days.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  pointInTimeRecoverySpecification: {
    pointInTimeRecoveryEnabled: true,
    recoveryPeriodInDays: 4,
  },
});
```