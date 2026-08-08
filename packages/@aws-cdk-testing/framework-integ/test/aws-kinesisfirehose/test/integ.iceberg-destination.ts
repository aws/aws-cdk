#!/usr/bin/env node
import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-iceberg-destination');

// Create S3 bucket for Iceberg data
const bucket = new s3.Bucket(stack, 'IcebergBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Create Glue database
const database = new glue.CfnDatabase(stack, 'IcebergDatabase', {
  catalogId: cdk.Stack.of(stack).account,
  databaseInput: {
    name: 'iceberg_db',
    description: 'Database for Iceberg tables',
  },
});

// Create Glue table for Iceberg
const table = new glue.CfnTable(stack, 'IcebergTable', {
  catalogId: cdk.Stack.of(stack).account,
  databaseName: database.ref,
  tableInput: {
    name: 'iceberg_table',
    tableType: 'EXTERNAL_TABLE',
    parameters: {
      table_type: 'ICEBERG',
      format: 'parquet',
    },
    storageDescriptor: {
      location: `s3://${bucket.bucketName}/warehouse/iceberg_db/iceberg_table`,
      inputFormat: 'org.apache.iceberg.mr.hive.HiveIcebergInputFormat',
      outputFormat: 'org.apache.iceberg.mr.hive.HiveIcebergOutputFormat',
      serdeInfo: {
        serializationLibrary: 'org.apache.iceberg.mr.hive.HiveIcebergSerDe',
      },
      columns: [
        {
          name: 'id',
          type: 'string',
        },
        {
          name: 'data',
          type: 'string',
        },
      ],
    },
  },
});
table.addDependency(database);

// Create delivery stream with Iceberg destination using catalogArn
new firehose.DeliveryStream(stack, 'IcebergDeliveryStreamWithCatalog', {
  destination: new firehose.IcebergDestination(bucket, {
    catalogConfiguration: {
      catalogArn: cdk.Stack.of(stack).formatArn({
        service: 'glue',
        resource: 'catalog',
      }),
    },
    destinationTableConfigurations: [
      {
        databaseName: database.ref,
        tableName: table.ref,
        uniqueKeys: ['id'],
      },
    ],
  }),
});

// Create delivery stream with warehouse location
const deliveryStreamWithWarehouse = new firehose.DeliveryStream(stack, 'IcebergDeliveryStreamWithWarehouse', {
  destination: new firehose.IcebergDestination(bucket, {
    catalogConfiguration: {
      warehouseLocation: `s3://${bucket.bucketName}/warehouse`,
    },
    destinationTableConfigurations: [
      {
        databaseName: database.ref,
        tableName: table.ref,
        uniqueKeys: ['id'],
      },
    ],
    // Minimize buffering to speed up test execution
    bufferingInterval: cdk.Duration.seconds(60),
    bufferingSize: cdk.Size.mebibytes(1),
  }),
});

// Create delivery stream with custom role
const customRole = new iam.Role(stack, 'CustomRole', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});

new firehose.DeliveryStream(stack, 'IcebergDeliveryStreamWithCustomRole', {
  destination: new firehose.IcebergDestination(bucket, {
    catalogConfiguration: {
      catalogArn: cdk.Stack.of(stack).formatArn({
        service: 'glue',
        resource: 'catalog',
      }),
    },
    destinationTableConfigurations: [
      {
        databaseName: database.ref,
        tableName: table.ref,
        uniqueKeys: ['id'],
      },
    ],
    role: customRole,
  }),
});

// Create delivery stream with all properties
new firehose.DeliveryStream(stack, 'IcebergDeliveryStreamAllProperties', {
  destination: new firehose.IcebergDestination(bucket, {
    catalogConfiguration: {
      catalogArn: cdk.Stack.of(stack).formatArn({
        service: 'glue',
        resource: 'catalog',
      }),
      warehouseLocation: `s3://${bucket.bucketName}/warehouse`,
    },
    destinationTableConfigurations: [
      {
        databaseName: database.ref,
        tableName: table.ref,
        uniqueKeys: ['id'],
        s3ErrorOutputPrefix: 'errors/iceberg_table/',
      },
    ],
    appendOnly: true,
    bufferingInterval: cdk.Duration.minutes(5),
    bufferingSize: cdk.Size.mebibytes(8),
    retryDuration: cdk.Duration.hours(2),
  }),
});

const testCase = new IntegTest(app, 'integ-tests', {
  testCases: [stack],
  regions: ['us-east-1'],
});

// Test actual data ingestion - send record to Firehose
testCase.assertions.awsApiCall('Firehose', 'putRecord', {
  DeliveryStreamName: deliveryStreamWithWarehouse.deliveryStreamName,
  Record: {
    Data: JSON.stringify({ id: 'test-id-123', data: 'test-data-value' }),
  },
});

// Verify that data was successfully stored in S3
const s3ApiCall = testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (s3ApiCall instanceof AwsApiCall && s3ApiCall.waiterProvider) {
  s3ApiCall.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}
