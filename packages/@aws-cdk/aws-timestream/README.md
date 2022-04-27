# AWS::Timestream Construct Library

Constructs for creating Timestream databases, tables, and scheduled queries.

## Database

THe most basic database construct

```ts
new Database(scope, "TimestreamDatabase");
```

You can include a specific database name

```ts
new Database(scope, "TimestreamDatabase", {
  databaseName: "iot_data",
});
```

And include a key for encryption

```ts
declare const key: kms.Key;

new Database(scope, "TimestreamDatabase", {
  databaseName: "iot_data",
  kmsKey: key,
});
```

## Table

Creating a simple table can be done with just a database reference.

```ts
declare const database: Database;

new Table(scope, "TimestreamTable", { database });
```

To specify name

```ts
declare const database: Database;

new Table(scope, "TimestreamTable", {
  database,
  tableName: "data_table",
});
```

### Magnetic Store Write Properties

You can specify how magnetic storage (hard drive) is used by the table.

```ts
declare const database: Database;
declare const bucket: s3.Bucket;

new Table(scope, "TimestreamTable", {
  database,
  magneticWriteEnable: true,
  magneticWriteBucket: bucket,
  magneticWriteEncryptionOption: EncryptionOptions.SSE_S3,
});
```

### Retention Properties

The retention duration for the memory store and magnetic store.

```ts
declare const database: Database;

new Table(scope, "TimestreamTable", {
  database,
  magneticStoreRetentionPeriod: Duration.days(20),
  memoryStoreRetentionPeriod: Duration.days(1),
});
```

## Scheduled Query

Create a scheduled query that will be run on your behalf at the configured schedule. Timestream assumes the execution role provided as part of the ScheduledQueryExecutionRoleArn parameter to run the query. You can use the NotificationTopic parameter for notifications for your scheduled query operations.

```ts
import * as events from '@aws-cdk/aws-events';
declare const table: Table;
declare const topic: sns.Topic;
declare const bucket: s3.Bucket;

new ScheduledQuery(scope, "ScheduledQuery", {
  queryString:
    'SELECT time, measure_name as name, measure_name as amount FROM "ATestDB"."Test"',
  errorReportBucket: bucket,
  errorReportEncryptionOption: EncryptionOptions.SSE_S3,
  errorReportObjectKeyPrefix: "prefix/",
  scheduledQueryName: "Test_Query",
  notificationTopic: topic,
  targetConfiguration: {
      dimensionMappings: [
        {
          name: "name",
          dimensionValueType: "VARCHAR",
        },
      ],
      multiMeasureMappings: {
        targetMultiMeasureName: "test",
        multiMeasureAttributeMappings: [
          {
            measureValueType: "VARCHAR",
            sourceColumn: "amount",
          },
        ],
      },
      table: table,
      timeColumn: "time",
  },
  schedule: events.Schedule.rate(Duration.days(1)),
  executionRole: role,
});
```
