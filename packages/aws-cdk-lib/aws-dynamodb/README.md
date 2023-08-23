# Amazon DynamoDB Construct Library


Here is a minimal deployable DynamoDB `GlobalTable` definition:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
});
```

By default, a `GlobalTable` will have one primary replica table in the main deployment region. The properties of the replica table in the main deployment region are configurable via the `GlobalTable` properties. For example, consider the following `GlobalTable` defined in a `Stack` being deployed to `us-west-2`:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
  tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
  pointInTimeRecovery: true,
});
```

The above `GlobalTable` definition will result in the provisioning of a single table in `us-west-2` with properties that match what was defined on the `GlobalTable`.

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html

## Keys

When a table is defined, you must define it's schema using the `partitionKey` (required) and `sortKey` (optional) properties.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
});
```

## Replicas

A `GlobalTable` can be configured with replica tables. To do this, the `GlobalTable` must be defined in a region non-agnostic `Stack`. Additionally, the main deployment region must not be given as a replica because this is created by default with the `GlobalTable`. The following is a minimal `GlobalTable` definition with replicas defined in `us-east-1` and `us-east-2`:

```ts
const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});
```

The following properties are configurable on a per-replica basis, but will be inherited from the `GlobalTable` properties if not specified:
* contributorInsights
* deletionProtection
* pointInTimeRecovery
* tableClass
* kinesisStream
* readCapacity (only configurable if the `GlobalTable` billing mode is `PROVISIONED`)
* globalSecondaryIndexes (only `contributorInsights` and `readCapacity`)

The following example shows how to define properties on a per-replica basis:

```ts
const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
  pointInTimeRecovery: true,
  replicas: [
    {
      region: 'us-east-1',
      tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
      pointInTimeRecovery: false,
    },
    {
      region: 'us-east-2',
      contributorInsights: false,
    },
  ],
});
```

Note: You can create a new `GlobalTable` with as many replicas as needed as long as there is only one replica per region. After table creation you can add or remove replicas, but you can only add or remove a single replica in each update.

## Table Class

You can configure a `GlobalTable` with table classes:
* STANDARD - the default mode, and is recommended for the vast majority of workloads.
* STANDARD_INFREQUENT_ACCESS - optimized for tables where storage is the dominant cost.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html

## Capacity

`GlobalTable` capacity options include:
* fixed - provisioned throughput capacity is configured with a fixed number of I/O operations per second.
* autoscaled - provisioned throughput capacity is dynamically adjusted on your behalf in response to actual traffic patterns.

The following properties are used to configure autoscaled capacity:
* minCapacity - Represents the minimum allowable capacity - optional with 1 as default.
* maxCapacity - Represents the maximum allowable capacity - required.
* targetUtilizationPercent - The ratio of consumed capacity units to provisioned capacity units - optional with 70 as default.

```ts
const capacity = dynamodb.Capacity.autoscaled({
  minCapacity: 5,
  maxCapacity: 20,
  targetUtilizationPercent: 60,
});
```

Note: `writeCapacity` can only be configured using autoscaled capacity.

## Billing

A `GlobalTable` can be configured with the following on-demand or provisioned billing:
* on-demand - The default option - this is a flexible billing option capable of serving requests without capacity planning. The billing mode will be `PAY_PER_REQUEST`.
* provisioned - Specify the `readCapacity` and `writeCapacity` that you need for your application. The billing mode will be `PROVISIONED`.

The following example shows how to configure a `GlobalTable` with on-demand billing:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.onDemand(),
})
```

When using provisioned billing, you must also specify `readCapacity` and `writeCapacity`. You can choose to configure `readCapacity` with fixed capacity or autoscaled capacity, but `writeCapacity` can only be configured with autoscaled capacity. The following example shows how to configure a `GlobalTable` with provisioned billing:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 15 }),
  }),
});
```

When using provisioned billing, you can configure the `readCapacity` on a per-replica basis:

```ts
const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 15 }),
  }),
  replicas: [
    {
      region: 'us-east-1',
    },
    {
      region: 'us-east-2',
      readCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 20, targetUtilizationPercent: 50 }),
    },
  ],
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html

## Global Secondary Indexes

## Local Secondary Indexes











Here is a minimal deployable DynamoDB table definition:

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
```

## Importing existing tables

To import an existing table into your CDK application, use the `Table.fromTableName`, `Table.fromTableArn` or `Table.fromTableAttributes`
factory method. This method accepts table name or table ARN which describes the properties of an already
existing table:

```ts
declare const user: iam.User;
const table = dynamodb.Table.fromTableArn(this, 'ImportedTable', 'arn:aws:dynamodb:us-east-1:111111111:table/my-table');
// now you can just call methods on the table
table.grantReadWriteData(user);
```

If you intend to use the `tableStreamArn` (including indirectly, for example by creating an
`aws-cdk-lib/aws-lambda-event-sources.DynamoEventSource` on the imported table), you *must* use the
`Table.fromTableAttributes` method and the `tableStreamArn` property *must* be populated.

In order to grant permissions to indexes on imported tables you can either set `grantIndexPermissions` to `true`, or you can provide the indexes via the `globalIndexes` or `localIndexes` properties. This will enable `grant*` methods to also grant permissions to *all* table indexes.

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

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.

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
const schema = table.schema();
const partitionKey = schema.partitionKey;
const sortKey = schema.sortKey;

// In case you want to get schema details for any secondary index
// const { partitionKey, sortKey } = table.schema(INDEX_NAME);
```

## Kinesis Stream

A Kinesis Data Stream can be configured on the DynamoDB table to capture item-level changes.

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
