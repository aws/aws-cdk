# Amazon DynamoDB Construct Library

> The DynamoDB construct library has two table constructs - `Table` and `TableV2`. `TableV2` is the preferred construct for all use cases, including creating a single table or a table with multiple `replicas`.

[`Table` API documentation](./TABLE_V1_API.md)

Here is a minimal deployable DynamoDB table using `TableV2`:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
});
```

By default, `TableV2` will create a single table in the main deployment region referred to as the primary table. The properties of the primary table are configurable via `TableV2` properties. For example, consider the following DynamoDB table created using the `TableV2` construct defined in a `Stack` being deployed to `us-west-2`:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
  tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
  pointInTimeRecovery: true,
});
```

The above `TableV2` definition will result in the provisioning of a single table in `us-west-2` with properties that match the properties set on the `TableV2` instance.

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html

## Replicas

The `TableV2` construct can be configured with replica tables. This will enable you to work with your table as a global table. To do this, the `TableV2` construct must be defined in a `Stack` with a defined region. The main deployment region must not be given as a replica because this is created by default with the `TableV2` construct. The following is a minimal example of defining `TableV2` with `replicas`. This `TableV2` definition will provision three copies of the table - one in `us-west-2` (primary deployment region), one in `us-east-1`, and one in `us-east-2`.

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});
```

Alternatively, you can add new `replicas` to an instance of the `TableV2` construct using the `addReplica` method:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [{ region: 'us-east-1' }],
});

globalTable.addReplica({ region: 'us-east-2', deletionProtection: true });
```

The following properties are configurable on a per-replica basis, but will be inherited from the `TableV2` properties if not specified:
* contributorInsights
* deletionProtection
* pointInTimeRecovery
* tableClass
* readCapacity (only configurable if the `TableV2` billing mode is `PROVISIONED`)
* globalSecondaryIndexes (only `contributorInsights` and `readCapacity`)

The following example shows how to define properties on a per-replica basis:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
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

To obtain an `ITableV2` reference to a specific replica table, call the `replica` method on an instance of the `TableV2` construct and pass the replica region as an argument:

```ts
import * as cdk from 'aws-cdk-lib';

declare const user: iam.User;

class FooStack extends cdk.Stack {
  public readonly globalTable: dynamodb.TableV2;

  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.globalTable = new dynamodb.TableV2(this, 'GlobalTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });
  }
}

interface BarStackProps extends cdk.StackProps {
  readonly replicaTable: dynamodb.ITableV2;
}

class BarStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: BarStackProps) {
    super(scope, id, props);

    // user is given grantWriteData permissions to replica in us-east-1
    props.replicaTable.grantWriteData(user);
  }
}

const app = new cdk.App();

const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2' } });
const barStack = new BarStack(app, 'BarStack', {
  replicaTable: fooStack.globalTable.replica('us-east-1'),
  env: { region: 'us-east-1' },
});
```

Note: You can create an instance of the `TableV2` construct with as many `replicas` as needed as long as there is only one replica per region. After table creation you can add or remove `replicas`, but you can only add or remove a single replica in each update.

## Billing

The `TableV2` construct can be configured with on-demand or provisioned billing:
* On-demand - The default option. This is a flexible billing option capable of serving requests without capacity planning. The billing mode will be `PAY_PER_REQUEST`.
* You can optionally specify the `maxReadRequestUnits` or `maxWriteRequestUnits` on individual tables and associated global secondary indexes (GSIs). When you configure maximum throughput for an on-demand table, throughput requests that exceed the maximum amount specified will be throttled.
* Provisioned - Specify the `readCapacity` and `writeCapacity` that you need for your application. The billing mode will be `PROVISIONED`. Capacity can be configured using one of the following modes:
  * Fixed - provisioned throughput capacity is configured with a fixed number of I/O operations per second.
  * Autoscaled - provisioned throughput capacity is dynamically adjusted on your behalf in response to actual traffic patterns.

Note: `writeCapacity` can only be configured using autoscaled capacity.

The following example shows how to configure `TableV2` with on-demand billing:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.onDemand(),
})
```

The following example shows how to configure `TableV2` with on-demand billing with optional maximum throughput configured:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.onDemand({
    maxReadRequestUnits: 100,
    maxWriteRequestUnits: 115,
  }),
})
```

When using provisioned billing, you must also specify `readCapacity` and `writeCapacity`. You can choose to configure `readCapacity` with fixed capacity or autoscaled capacity, but `writeCapacity` can only be configured with autoscaled capacity. The following example shows how to configure `TableV2` with provisioned billing:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 15 }),
  }),
});
```

When using provisioned billing, you can configure the `readCapacity` on a per-replica basis:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
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

When changing the billing for a table from provisioned to on-demand or from on-demand to provisioned, `seedCapacity` must be configured for each autoscaled resource:

```ts
const globalTable = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 10, seedCapacity: 20 }),
  }),
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html

## Warm Throughput
Warm throughput refers to the number of read and write operations your DynamoDB table can instantaneously support.

This optional configuration allows you to pre-warm your table or index to handle anticipated throughput, ensuring optimal performance under expected load.

The Warm Throughput configuration settings are automatically replicated across all Global Table replicas.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  warmThroughput: {
      readUnitsPerSecond: 15000,
      writeUnitsPerSecond: 20000,
    },
});
```
Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/warm-throughput.html

## Encryption

All user data stored in a DynamoDB table is fully encrypted at rest. When creating an instance of the `TableV2` construct, you can select the following table encryption options:
* AWS owned keys - Default encryption type. The keys are owned by DynamoDB (no additional charge).
* AWS managed keys - The keys are stored in your account and are managed by AWS KMS (AWS KMS charges apply).
* Customer managed keys - The keys are stored in your account and are created, owned, and managed by you. You have full control over the KMS keys (AWS KMS charges apply).

The following is an example of how to configure `TableV2` with encryption using an AWS owned key:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.dynamoOwnedKey(),
})
```

The following is an example of how to configure `TableV2` with encryption using an AWS managed key:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.awsManagedKey(),
})
```

When configuring `TableV2` with encryption using customer managed keys, you must specify the KMS key for the primary table as the `tableKey`. A map of `replicaKeyArns` must be provided containing each replica region and the associated KMS key ARN:

```ts
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const tableKey = new kms.Key(stack, 'Key');
const replicaKeyArns = {
  'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
  'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/h90bkasj-bs1j-92wp-s2ka-bh857d60bkj8',
};

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});
```

Note: When encryption is configured with customer managed keys, you must have a key already created in each replica region.

Further reading:
https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-mgmt

## Secondary Indexes

Secondary indexes allow efficient access to data with attributes other than the `primaryKey`. DynamoDB supports two types of secondary indexes:

* Global secondary index - An index with a `partitionKey` and a `sortKey` that can be different from those on the base table. A `globalSecondaryIndex` is considered "global" because queries on the index can span all of the data in the base table, across all partitions. A `globalSecondaryIndex` is stored in its own partition space away from the base table and scales separately from the base table.

* Local secondary index - An index that has the same `partitionKey` as the base table, but a different `sortKey`. A `localSecondaryIndex` is "local" in the sense that every partition of a `localSecondaryIndex` is scoped to a base table partition that has the same `partitionKey` value.

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html

### Global Secondary Indexes

`TableV2` can be configured with `globalSecondaryIndexes` by providing them as a `TableV2` property:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  globalSecondaryIndexes: [
    {
      indexName: 'gsi',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
    },
  ],
});
```

Alternatively, you can add a `globalSecondaryIndex` using the `addGlobalSecondaryIndex` method:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  globalSecondaryIndexes: [
    {
      indexName: 'gsi1',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
    },
  ],
});

table.addGlobalSecondaryIndex({
  indexName: 'gsi2',
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
});
```

You can configure `readCapacity` and `writeCapacity` on a `globalSecondaryIndex` when an `TableV2` is configured with provisioned `billing`. If `TableV2` is configured with provisioned `billing` but `readCapacity` or `writeCapacity` are not configured on a `globalSecondaryIndex`, then they will be inherited from the capacity settings specified with the `billing` configuration:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 10 }),
  }),
  globalSecondaryIndexes: [
    {
      indexName: 'gsi1',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      readCapacity: dynamodb.Capacity.fixed(15),
      // write capacity inherited from billing - dynamodb.Capacity.autoscaled({ maxCapacity: 10 })
    },
    {
      indexName: 'gsi2',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      writeCapacity: dynamodb.Capacity.autoscaled({ minCapacity: 5, maxCapacity: 20 }),
      // read capacity inherited from billing - dynamodb.Capacity.fixed(10)
    },
  ],
});
```

All `globalSecondaryIndexes` for replica tables are inherited from the primary table. You can configure `contributorInsights` and `readCapacity` for each `globalSecondaryIndex` on a per-replica basis:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 10 }),
  }),
  // each global secondary index will inherit contributor insights as true
  globalSecondaryIndexes: [
    {
      indexName: 'gsi1',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      readCapacity: dynamodb.Capacity.fixed(15),
    },
    {
      indexName: 'gsi2',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      writeCapacity: dynamodb.Capacity.autoscaled({ minCapacity: 5, maxCapacity: 20 }),
    },
  ],
  replicas: [
    {
      region: 'us-east-1',
      globalSecondaryIndexOptions: {
        gsi1: {
          readCapacity: dynamodb.Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 })
        },
      },
    },
    {
      region: 'us-east-2',
      globalSecondaryIndexOptions: {
        gsi2: {
          contributorInsights: false,
        },
      },
    },
  ],
});
```

### Local Secondary Indexes

`TableV2` can only be configured with `localSecondaryIndexes` when a `sortKey` is defined as a `TableV2` property.

You can provide `localSecondaryIndexes` as a `TableV2` property:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
  localSecondaryIndexes: [
    {
      indexName: 'lsi',
      sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
    },
  ],
});
```

Alternatively, you can add a `localSecondaryIndex` using the `addLocalSecondaryIndex` method:

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
  localSecondaryIndexes: [
    {
      indexName: 'lsi1',
      sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
    },
  ],
});

table.addLocalSecondaryIndex({
  indexName: 'lsi2',
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
});
```

## Streams

Each DynamoDB table produces an independent stream based on all its writes, regardless of the origination point for those writes. DynamoDB supports two stream types:
* DynamoDB streams - Capture item-level changes in your table, and push the changes to a DynamoDB stream. You then can access the change information through the DynamoDB Streams API.
* Kinesis streams - Amazon Kinesis Data Streams for DynamoDB captures item-level changes in your table, and replicates the changes to a Kinesis data stream. You then can consume and manage the change information from Kinesis.

### DynamoDB Streams

A `dynamoStream` can be configured as a `TableV2` property. If the `TableV2` instance has replica tables, then all replica tables will inherit the `dynamoStream` setting from the primary table.  If replicas are configured, but `dynamoStream` is not configured, then the primary table and all replicas will be automatically configured with the `NEW_AND_OLD_IMAGES` stream view type.

```ts
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(this, 'GlobalTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  dynamoStream: dynamodb.StreamViewType.OLD_IMAGE,
  // tables in us-west-2, us-east-1, and us-east-2 all have dynamo stream type of OLD_IMAGES
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html

### Kinesis Streams

A `kinesisStream` can be configured as a `TableV2` property. Replica tables will not inherit the `kinesisStream` configured for the primary table and should added on a per-replica basis.

```ts
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const stream1 = new kinesis.Stream(stack, 'Stream1');
const stream2 = kinesis.Stream.fromStreamArn(stack, 'Stream2', 'arn:aws:kinesis:us-east-2:123456789012:stream/my-stream');

const globalTable = new dynamodb.TableV2(this, 'GlobalTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  kinesisStream: stream1, // for table in us-west-2
  replicas: [
    { region: 'us-east-1' }, // no kinesis data stream will be set for this replica
    {
      region: 'us-east-2',
      kinesisStream: stream2, // for table in us-east-2
    },
  ],
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/kds.html

## Keys

When an instance of the `TableV2` construct is defined, you must define its schema using the `partitionKey` (required) and `sortKey` (optional) properties.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
});
```

## Contributor Insights

Enabling `contributorInsights` for `TableV2` will provide information about the most accessed and throttled items in a table or `globalSecondaryIndex`. DynamoDB delivers this information to you via CloudWatch Contributor Insights rules, reports, and graphs of report data.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
});
```

When you use `Table`, you can enable contributor insights for a table or specific global secondary index by setting `contributorInsightsEnabled` to `true`.

```ts
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsightsEnabled: true, // for a table
});

table.addGlobalSecondaryIndex({
  contributorInsightsEnabled: true, // for a specific global secondary index
  indexName: 'gsi',
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/contributorinsights_HowItWorks.html

## Deletion Protection

`deletionProtection` determines if your DynamoDB table is protected from deletion and is configurable as a `TableV2` property. When enabled, the table cannot be deleted by any user or process.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  deletionProtection: true,
});
```

You can also specify the `removalPolicy` as a property of the `TableV2` construct. This property allows you to control what happens to tables provisioned using `TableV2` during `stack` deletion. By default, the `removalPolicy` is `RETAIN` which will cause all tables provisioned using `TableV2` to be retained in the account, but orphaned from the `stack` they were created in. You can also set the `removalPolicy` to `DESTROY` which will delete all tables created using `TableV2` during `stack` deletion:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  // applies to all replicas, i.e., us-west-2, us-east-1, us-east-2
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});
```

`deletionProtection` is configurable on a per-replica basis. If the `removalPolicy` is set to `DESTROY`, but some `replicas` have `deletionProtection` enabled, then only the `replicas` without `deletionProtection` will be deleted during `stack` deletion:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  deletionProtection: true,
  // only the replica in us-east-1 will be deleted during stack deletion
  replicas: [
    {
      region: 'us-east-1',
      deletionProtection: false,
    },
    {
      region: 'us-east-2',
      deletionProtection: true,
    },
  ],
});
```

## Point-in-Time Recovery

`pointInTimeRecovery` provides automatic backups of your DynamoDB table data which helps protect your tables from accidental write or delete operations.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  pointInTimeRecovery: true,
});
```

## Table Class

You can configure a `TableV2` instance with table classes:
* STANDARD - the default mode, and is recommended for the vast majority of workloads.
* STANDARD_INFREQUENT_ACCESS - optimized for tables where storage is the dominant cost.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.TableClasses.html

## Tags

You can add tags to a `TableV2` in several ways. By adding the tags to the construct itself it will apply the tags to the
primary table.
```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  tags: [{key: 'primaryTableTagKey', value: 'primaryTableTagValue'}],
});
```

You can also add tags to replica tables by specifying them within the replica table properties.

```ts
const table = new dynamodb.TableV2(this, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [
    {
      region: 'us-west-1',
      tags: [{key: 'replicaTableTagKey', value: 'replicaTableTagValue'}]
    }
  ]
});
```

## Referencing Existing Global Tables

To reference an existing DynamoDB table in your CDK application, use the `TableV2.fromTableName`, `TableV2.fromTableArn`, or `TableV2.fromTableAttributes`
factory methods:

```ts
declare const user: iam.User;

const table = dynamodb.TableV2.fromTableArn(this, 'ImportedTable', 'arn:aws:dynamodb:us-east-1:123456789012:table/my-table');
// now you can call methods on the referenced table
table.grantReadWriteData(user);
```

If you intend to use the `tableStreamArn` (including indirectly, for example by creating an
`aws-cdk-lib/aws-lambda-event-sources.DynamoEventSource` on the referenced table), you *must* use the
`TableV2.fromTableAttributes` method and the `tableStreamArn` property *must* be populated.

To grant permissions to indexes for a referenced table you can either set `grantIndexPermissions` to `true`, or you can provide the indexes via the `globalIndexes` or `localIndexes` properties. This will enable `grant*` methods to also grant permissions to *all* table indexes.

## Resource Policy

Using `resourcePolicy` you can add a [resource policy](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-resource-based.html) to a table in the form of a `PolicyDocument`:

```
    // resource policy document
    const policy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['dynamodb:GetItem'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
    });

    // table with resource policy
    new dynamodb.TableV2(this, 'TableTestV2-1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      resourcePolicy: policy,
    });
```

TableV2 doesn’t support creating a replica and adding a resource-based policy to that replica in the same stack update in Regions other than the Region where you deploy the stack update.
To incorporate a resource-based policy into a replica, you'll need to initially deploy the replica without the policy, followed by a subsequent update to include the desired policy.

## Grants

Using any of the `grant*` methods on an instance of the `TableV2` construct will only apply to the primary table, its indexes, and any associated `encryptionKey`. As an example, `grantReadData` used below will only apply the table in `us-west-2`:

```ts
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

declare const user: iam.User;

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const tableKey = new kms.Key(stack, 'Key');
const replicaKeyArns = {
  'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
  'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
};

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});

// grantReadData only applies to the table in us-west-2 and the tableKey
globalTable.grantReadData(user);
```

The `replica` method can be used to grant to a specific replica table:

```ts
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

declare const user: iam.User;

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const tableKey = new kms.Key(stack, 'Key');
const replicaKeyArns = {
  'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
  'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
};

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});

// grantReadData applies to the table in us-east-2 and the key arn for the key in us-east-2
globalTable.replica('us-east-2').grantReadData(user);
```

## Metrics

You can use `metric*` methods to generate metrics for a table that can be used when configuring an `Alarm` or `Graphs`. The `metric*` methods only apply to the primary table provisioned using the `TableV2` construct. As an example, `metricConsumedReadCapacityUnits` used below is only for the table in `us-west-2`:

```ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.TableV2(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});

// metric is only for the table in us-west-2
const metric = globalTable.metricConsumedReadCapacityUnits();

new cloudwatch.Alarm(this, 'Alarm', {
  metric: metric,
  evaluationPeriods: 1,
  threshold: 1,
});
```

The `replica` method can be used to generate a metric for a specific replica table:

```ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

class FooStack extends cdk.Stack {
  public readonly globalTable: dynamodb.TableV2;

  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.globalTable = new dynamodb.TableV2(this, 'GlobalTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });
  }
}

interface BarStackProps extends cdk.StackProps {
  readonly replicaTable: dynamodb.ITableV2;
}

class BarStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: BarStackProps) {
    super(scope, id, props);

    // metric is only for the table in us-east-1
    const metric = props.replicaTable.metricConsumedReadCapacityUnits();

    new cloudwatch.Alarm(this, 'Alarm', {
      metric: metric,
      evaluationPeriods: 1,
      threshold: 1,
    });
  }
}

const app = new cdk.App();
const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2' } });
const barStack = new BarStack(app, 'BarStack', {
  replicaTable: fooStack.globalTable.replica('us-east-1'),
  env: { region: 'us-east-1' },
});
```

## import from S3 Bucket
You can import data in S3 when creating a Table using the `Table` construct.
To import data into DynamoDB, it is required that your data is in a CSV, DynamoDB JSON, or Amazon Ion format within an Amazon S3 bucket.
The data may be compressed using ZSTD or GZIP formats, or you may choose to import it without compression.
The data source can be a single S3 object or multiple S3 objects sharing a common prefix.


Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataImport.HowItWorks.html

### use CSV format
The `InputFormat.csv` method accepts `delimiter` and `headerList` options as arguments.
If `delimiter` is not specified, `,` is used by default.
And if `headerList` is specified, the first line of CSV is treated as data instead of header.

```ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');

declare const bucket: s3.IBucket;

new dynamodb.Table(stack, 'Table', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  importSource: {
    compressionType: dynamodb.InputCompressionType.GZIP,
    inputFormat: dynamodb.InputFormat.csv({
      delimiter: ',',
      headerList: ['id', 'name'],
    }),
    bucket,
    keyPrefix: 'prefix',
  },
});
```

### use DynamoDB JSON format
Use the `InputFormat.dynamoDBJson()` method to specify the `inputFormat` property.
There are currently no options available.

```ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');

declare const bucket: s3.IBucket;

new dynamodb.Table(stack, 'Table', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  importSource: {
    compressionType: dynamodb.InputCompressionType.GZIP,
    inputFormat: dynamodb.InputFormat.dynamoDBJson(),
    bucket,
    keyPrefix: 'prefix',
  },
});
```

### use Amazon Ion format
Use the `InputFormat.ion()` method to specify the `inputFormat` property.
There are currently no options available.

```ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack');

declare const bucket: s3.IBucket;

new dynamodb.Table(stack, 'Table', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  importSource: {
    compressionType: dynamodb.InputCompressionType.GZIP,
    inputFormat: dynamodb.InputFormat.ion(),
    bucket,
    keyPrefix: 'prefix',
  },
});
```
