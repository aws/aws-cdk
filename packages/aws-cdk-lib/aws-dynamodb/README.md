# Amazon DynamoDB Construct Library

> The DynamoDB construct library has two table constructs - `Table` and `GlobalTable`. `GlobalTable` is the preferred construct to use for creating a single table or a table with multiple `replicas`. A `GlobalTable` without any `replicas` configured will create a single table in the primary deployment region and will behave in the same way as the `Table` construct.

[`Table` API documentation](./ORIGINAL_API.md)

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

## Replicas

A `GlobalTable` can be configured with replica tables. To do this, the `GlobalTable` must be defined in a region non-agnostic `Stack`. The main deployment region must not be given as a replica because this is created by default with the `GlobalTable`. The following is a minimal `GlobalTable` definition with `replicas` defined in `us-east-1` and `us-east-2`:

```ts
import * as cdk from 'aws-cdk-lib';

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

Alternatively, you can add new `replicas` to a `GlobalTable` using the `addReplica` method:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  replicas: [{ region: 'us-east-1' }],
});

globalTable.addReplica({ region: 'us-east-2', deletionProtection: true });
```

The following properties are configurable on a per-replica basis, but will be inherited from the `GlobalTable` properties if not specified:
* contributorInsights
* deletionProtection
* pointInTimeRecovery
* tableClass
* readCapacity (only configurable if the `GlobalTable` billing mode is `PROVISIONED`)
* globalSecondaryIndexes (only `contributorInsights` and `readCapacity`)

The following example shows how to define properties on a per-replica basis:

```ts
import * as cdk from 'aws-cdk-lib';

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

To obtain an `IGlobalTable` reference to a specific replica in a `GlobalTable`, call the `replica` method on the `GlobalTable` and pass the replica region as an argument:

```ts
import * as cdk from 'aws-cdk-lib';

declare const user: iam.User;

class FooStack extends cdk.Stack {
  public readonly globalTable: dynamodb.GlobalTable;

  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });
  }
}

interface BarStackProps extends cdk.StackProps {
  readonly replicaTable: dynamodb.IGlobalTable;
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

Note: You can create a new `GlobalTable` with as many `replicas` as needed as long as there is only one replica per region. After table creation you can add or remove `replicas`, but you can only add or remove a single replica in each update.

## Billing

A `GlobalTable` can be configured with on-demand or provisioned billing:
* On-demand - The default option. This is a flexible billing option capable of serving requests without capacity planning. The billing mode will be `PAY_PER_REQUEST`.
* Provisioned - Specify the `readCapacity` and `writeCapacity` that you need for your application. The billing mode will be `PROVISIONED`. Capacity can be configured using one of the following modes:
  * Fixed - provisioned throughput capacity is configured with a fixed number of I/O operations per second.
  * Autoscaled - provisioned throughput capacity is dynamically adjusted on your behalf in response to actual traffic patterns.

Note: `writeCapacity` can only be configured using autoscaled capacity.

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
import * as cdk from 'aws-cdk-lib';

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

## Encryption

All user data stored in a `GlobalTable` is fully encrypted at rest. When creating a new `GlobalTable`, you can select the following table encryption options:
* AWS owned keys - Default encryption type. The keys are owned by DynamoDB (no additional charge).
* AWS managed keys - The keys are stored in your account and are managed by AWS KMS (AWS KMS charges apply).
* Customer managed keys - The keys are stored in your account and are created, owned, and managed by you. You have full control over the KMS keys (AWS KMS charges apply).

The following is an example of how to configure `GlobalTable` encryption using an AWS owned key:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.dynamoOwnedKey(),
})
```

The following is an example of how to configure `GlobalTable` encryption using an AWS managed key:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.awsManagedKey(),
})
```

When configuring `GlobalTable` encryption using customer managed keys, you must specify the KMS key for the table in the main deployment region as the `tableKey`. A map of `replicaKeyArns` must be provided containing each replica region and the associated KMS key ARN:

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

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
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

A `GlobalTable` can be configured with `globalSecondaryIndexes` by providing them as a `GlobalTable` property:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
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
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  globalSecondaryIndexes: [
    {
      indexName: 'gsi1',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
    },
  ],
});

globalTable.addGlobalSecondaryIndex({
  indexName: 'gsi2',
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
});
```

You can configure `readCapacity` and `writeCapacity` on a `globalSecondaryIndex` when the `GlobalTable` is configured with provisioned billing. In the event that the `GlobalTable` is configured with provisioned billing but `readCapacity` or `writeCapacity` are not configured on a `globalSecondaryIndex`, then they will be inherited from the `GlobalTable`:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
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
      // write capacity inherited from global table - dynamodb.Capacity.autoscaled({ maxCapacity: 10 })
    },
    {
      indexName: 'gsi2',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      writeCapacity: dynamodb.Capacity.autoscaled({ minCapacity: 5, maxCapacity: 20 }),
      // read capacity inherited from global table - dynamodb.Capacity.fixed(10)
    },
  ],
});
```

All `globalSecondaryIndexes` for replica tables are inherited from the `GlobalTable`. You can configure `contributorInsights` and `readCapacity` for each `globalSecondaryIndex` on a per-replica basis:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
  billing: dynamodb.Billing.provisioned({
    readCapacity: dynamodb.Capacity.fixed(10),
    writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 10 }),
  }),
  // each global secondary index will inherit contributor insights as true from the global table
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

Note: `contributorInsights` for `globalSecondaryIndexes` are inherited from the `GlobalTable`.

### Local Secondary Indexes

A `GlobalTable` can only be configured with `localSecondaryIndexes` when the `GlobalTable` has a `sortKey`. You can provide `localSecondaryIndexes` as a `GlobalTable` property:

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
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
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
  localSecondaryIndexes: [
    {
      indexName: 'lsi1',
      sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
    },
  ],
});

globalTable.addLocalSecondaryIndex({
  indexName: 'lsi2',
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
});
```

## Streams

Each `GlobalTable` produces an independent stream based on all its writes, regardless of the origination point for those writes. DynamoDB supports two stream types:
* DynamoDB streams - Capture item-level changes in your table, and push the changes to a DynamoDB stream. You then can access the change information through the DynamoDB Streams API.
* Kinesis streams - Amazon Kinesis Data Streams for DynamoDB captures item-level changes in your table, and replicates the changes to a Kinesis data stream. You then can consume and manage the change information from Kinesis.

### DynamoDB Streams

A `dynamoStream` configured as a `GlobalTable` property will be inherited by all replicas. If replicas are configured as part of a `GlobalTable`, but `dynamoStream` is not configured, then all replicas will be automatically configured using the `NEW_AND_OLD_IMAGES` stream view type.

```ts
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
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

`kinesisStreams` must be configured on a per-replica basis. A `kinesisStream` configured as a `GlobalTable` property will only apply to the table in the primary deployment region.

```ts
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const stream1 = new kinesis.Stream(stack, 'Stream1');
const stream2 = kinesis.Stream.fromStreamArn(stack, 'Stream2', 'arn:aws:kinesis:us-east-2:123456789012:stream/my-stream');

const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
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

When a `GlobalTable` is defined, you must define its schema using the `partitionKey` (required) and `sortKey` (optional) properties.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'sk', type: dynamodb.AttributeType.NUMBER },
});
```

## Contributor Insights

Enabling `contributorInsights` for a `GlobalTable` will provide information about the most accessed and throttled items in a table or `globalSecondaryIndex`. DynamoDB delivers this information to you via CloudWatch Contributor Insights rules, reports, and graphs of report data.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  contributorInsights: true,
});
```

Further reading:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/contributorinsights_HowItWorks.html

## Deletion Protection

`deletionProtection` determines if your `GlobalTable` is protected from deletion. When enabled, the `GlobalTable` cannot be deleted by any user or process.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  deletionProtection: true,
});
```

You can also specify the `removalPolicy` as a property of a `GlobalTable`. This property allows you to control what happens to the `GlobalTable` resource during `stack` deletion. By default, the `removalPolicy` is `RETAIN` which will cause the `GlobalTable` to be retained in the account, but orphaned from the `stack` it was created in. You can also set the `removalPolicy` to `DESTROY` which will delete thanye `GlobalTable` during `stack` deletion:

```ts
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  // applys to all replicas, i.e., us-west-2, us-east-1, us-east-2
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

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
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

`pointInTimeRecovery` provides automatic backups of your `GlobalTable` data which helps protect your `GlobalTable` from accidental write or delete operations.

```ts
const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  pointInTimeRecovery: true,
});
```

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

## Referencing Existing Global Tables

To reference an existing `GlobalTable` in your CDK application, use one of the `GlobalTable.fromTableName`, `GlobalTable.fromTableArn` or `GlobalTable.fromTableAttributes`
factory methods:

```ts
declare const user: iam.User;

const globalTable = dynamodb.GlobalTable.fromTableArn(this, 'ImportedGlobalTable', 'arn:aws:dynamodb:us-east-1:123456789012:table/my-global-table');
// now you can call methods on the referenced global table
globalTable.grantReadWriteData(user);
```

If you intend to use the `tableStreamArn` (including indirectly, for example by creating an
`aws-cdk-lib/aws-lambda-event-sources.DynamoEventSource` on the referenced `GlobalTable`), you *must* use the
`GlobalTable.fromTableAttributes` method and the `tableStreamArn` property *must* be populated.

To grant permissions to indexes for a referenced `GlobalTable` you can either set `grantIndexPermissions` to `true`, or you can provide the indexes via the `globalIndexes` or `localIndexes` properties. This will enable `grant*` methods to also grant permissions to *all* table indexes.

## Grants

Using any of the `grant*` methods on a `GlobalTable` will only apply to the table in the main deployment region, its indexes, and any associated `encryptionKey`. As an example, `grantReadData` used below will only apply the table in `us-west-2`:

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

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});

// grantReadData only applys to the table in us-west-2 and the tableKey
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

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
  replicas: [
    { region: 'us-east-1' },
    { region: 'us-east-2' },
  ],
});

// grantReadData applys to the table in us-east-2 and the key arn for the key in us-east-2
globalTable.replica('us-east-2').grantReadData(user);
```

## Metrics

You can use `metric*` methods to generate metrics for a `GlobalTable` that can be used when configuring an `Alarm` or `Graphs`. The `metric*` methods only apply to the table in the main deployment region for a `GlobalTable`. As an example, `metricConsumedReadCapacityUnits` used below is only for the table in `us-west-2`:

```ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const globalTable = new dynamodb.GlobalTable(stack, 'GlobalTable', {
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
import * as cdk form 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

class FooStack extends cdk.Stack {
  public readonly globalTable: dynamodb.GlobalTable;

  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });
  }
}

interface BarStack extends cdk.StackProps {
  readonly replicaTable: dynamodb.IGlobalTable;
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
