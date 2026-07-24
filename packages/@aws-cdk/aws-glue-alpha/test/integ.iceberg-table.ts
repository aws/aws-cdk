import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue-iceberg');

const bucket = new s3.Bucket(stack, 'WarehouseBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const database = new glue.Database(stack, 'IcebergDatabase', {
  databaseName: 'iceberg_integ_db',
});

new glue.IcebergTable(stack, 'OrdersTable', {
  database,
  tableName: 'orders',
  comment: 'Iceberg integ-test orders table.',
  columns: [
    { name: 'order_id', type: glue.IcebergType.LONG, required: true, id: 1 },
    { name: 'customer_id', type: glue.IcebergType.LONG, required: true, id: 2 },
    { name: 'order_amount', type: glue.IcebergType.decimal(12, 2), required: true, id: 3 },
    { name: 'currency', type: glue.IcebergType.STRING, required: true, id: 4 },
    { name: 'placed_at', type: glue.IcebergType.TIMESTAMPTZ, required: true, id: 5 },
    { name: 'tags', type: glue.IcebergType.list(glue.IcebergType.STRING), id: 6 },
    {
      name: 'shipping_address',
      type: glue.IcebergType.struct([
        { name: 'city', type: glue.IcebergType.STRING, required: true },
        { name: 'country', type: glue.IcebergType.STRING, required: true },
      ]),
      id: 7,
    },
    {
      name: 'metadata',
      type: glue.IcebergType.map(glue.IcebergType.STRING, glue.IcebergType.STRING, false),
      id: 8,
    },
  ],
  location: `s3://${bucket.bucketName}/orders/`,
  partitionSpec: [
    { sourceColumn: 'placed_at', transform: glue.IcebergPartitionTransform.DAY },
    { sourceColumn: 'customer_id', transform: glue.IcebergPartitionTransform.bucket(16) },
  ],
  sortOrder: [
    {
      sourceColumn: 'placed_at',
      direction: glue.IcebergSortDirection.ASC,
      nullOrder: glue.IcebergNullOrder.NULLS_LAST,
    },
  ],
  identifierFieldNames: ['order_id'],
  dataFormat: glue.IcebergDataFormat.PARQUET,
  formatVersion: glue.IcebergFormatVersion.V2,
  tableProperties: {
    'write.parquet.compression-codec': 'zstd',
    'write.delete.mode': 'merge-on-read',
    'write.update.mode': 'merge-on-read',
    'write.merge.mode': 'merge-on-read',
    'history.expire.min-snapshots-to-keep': '5',
    'gc.enabled': 'true',
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new glue.IcebergTable(stack, 'EventsTable', {
  database,
  tableName: 'events',
  columns: [
    { name: 'event_id', type: glue.IcebergType.STRING, required: true, id: 1 },
    { name: 'occurred_at', type: glue.IcebergType.TIMESTAMPTZ, required: true, id: 2 },
    {
      name: 'attributes',
      type: glue.IcebergType.map(glue.IcebergType.STRING, glue.IcebergType.STRING, false),
      id: 3,
    },
  ],
  location: `s3://${bucket.bucketName}/events/`,
  partitionSpec: [
    { sourceColumn: 'occurred_at', transform: glue.IcebergPartitionTransform.HOUR },
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'aws-cdk-glue-iceberg-integ', {
  testCases: [stack],
});

app.synth();
