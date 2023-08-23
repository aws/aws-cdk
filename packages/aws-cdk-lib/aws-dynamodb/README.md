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

When a `GlobalTable` is defined, you must define it's schema using the `partitionKey` (required) and `sortKey` (optional) properties.

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

## Kinesis Stream

A Kinesis Data Stream can be configured on a `GlobalTable` to capture item-level changes. The Kinesis Data Stream configured on a `GlobalTable` will only apply to the table in the primary deployment region and will not be inherited by any replica tables. Replica specific Kinesis Data Streams should be configured on a per-replica basis.

```ts
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

const stream1 = new kinesis.Stream(stack, 'Stream1');
const stream2 = kinesis.Stream.fromStreamArn(stack, 'Stream2', 'arn:aws:kinesis:us-east-2:123456789012:stream/my-stream');

const globalTable = new dynamodb.GlobalTable(this, 'GlobalTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  kinesisStream: stream1,
  replicas: [
    { region: 'us-east-1' }, // no kinesis data stream will be set for this replica
    {
      region: 'us-east-2',
      kinesisStream: stream2,
    },
  ],
});
```

## Replicas

A `GlobalTable` can be configured with replica tables. To do this, the `GlobalTable` must be defined in a region non-agnostic `Stack`. Additionally, the main deployment region must not be given as a replica because this is created by default with the `GlobalTable`. The following is a minimal `GlobalTable` definition with replicas defined in `us-east-1` and `us-east-2`:

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

Alternatively, you can add new replicas to a `GlobalTable` using the `addReplica` method:

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

You can retrieve a single replica from a `GlobalTable` using the `replica` method:

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

const replicaTable = globalTable.replica('us-east-2');
```

Note: You can create a new `GlobalTable` with as many replicas as needed as long as there is only one replica per region. After table creation you can add or remove replicas, but you can only add or remove a single replica in each update.

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

A `GlobalTable` can be configured with on-demand or provisioned billing:
* on-demand - The default option. This is a flexible billing option capable of serving requests without capacity planning. The billing mode will be `PAY_PER_REQUEST`.
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

```

Note: When encryption is configured with customer managed keys, you must have a key already created in each replica region.

Further reading:
https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-mgmt

## Global Secondary Indexes

You can configure a `GlobalTable` with `globalSecondaryIndexes`:

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

## Local Secondary Indexes

A `GlobalTable` can be configured with `localSecondaryIndexes` when the `GlobalTable` also has a `sortKey`:

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

## Importing Existing Global Tables

To import an existing `GlobalTable` into your CDK application, use one of the `GlobalTable.fromTableName`, `GlobalTable.fromTableArn` or `GlobalTable.fromTableAttributes`
factory methods:

```ts
declare const user: iam.User;

const globalTable = dynamodb.GlobalTable.fromTableArn(this, 'ImportedGlobalTable', 'arn:aws:dynamodb:us-east-1:123456789012:table/my-global-table');
// now you can call methods on the imported global table
globalTable.grantReadWriteData(user);
```

If you intend to use the `tableStreamArn` (including indirectly, for example by creating an
`aws-cdk-lib/aws-lambda-event-sources.DynamoEventSource` on the imported `GlobalTable`), you *must* use the
`GlobalTable.fromTableAttributes` method and the `tableStreamArn` property *must* be populated.

To grant permissions to indexes an imported `GlobalTable` you can either set `grantIndexPermissions` to `true`, or you can provide the indexes via the `globalIndexes` or `localIndexes` properties. This will enable `grant*` methods to also grant permissions to *all* table indexes.

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

---

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
