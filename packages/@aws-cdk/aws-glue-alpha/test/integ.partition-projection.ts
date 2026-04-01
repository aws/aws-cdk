import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as glue from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-glue-partition-projection');

const database = new glue.Database(stack, 'Database', {
  databaseName: 'partition_projection_test',
});

// Test INTEGER partition projection
new glue.S3Table(stack, 'TableInteger', {
  database,
  tableName: 'integer_projection',
  columns: [{
    name: 'data',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.INTEGER,
  }],
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: {
    year: glue.PartitionProjectionConfiguration.integer({
      min: 2020,
      max: 2023,
      interval: 1,
      digits: 4,
    }),
  },
});

// Test DATE partition projection
new glue.S3Table(stack, 'TableDate', {
  database,
  tableName: 'date_projection',
  columns: [{
    name: 'data',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'date',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: {
    date: glue.PartitionProjectionConfiguration.date({
      min: '2020-01-01',
      max: '2023-12-31',
      format: 'yyyy-MM-dd',
      interval: 1,
      intervalUnit: glue.DateIntervalUnit.DAYS,
    }),
  },
});

// Test ENUM partition projection
new glue.S3Table(stack, 'TableEnum', {
  database,
  tableName: 'enum_projection',
  columns: [{
    name: 'data',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'region',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: {
    region: glue.PartitionProjectionConfiguration.enum({
      values: ['us-east-1', 'us-west-2', 'eu-west-1'],
    }),
  },
});

// Test INJECTED partition projection
new glue.S3Table(stack, 'TableInjected', {
  database,
  tableName: 'injected_projection',
  columns: [{
    name: 'data',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'custom',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: {
    custom: glue.PartitionProjectionConfiguration.injected(),
  },
});

// Test multiple partition projections
new glue.S3Table(stack, 'TableMultiple', {
  database,
  tableName: 'multiple_projection',
  columns: [{
    name: 'data',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [
    {
      name: 'year',
      type: glue.Schema.INTEGER,
    },
    {
      name: 'month',
      type: glue.Schema.INTEGER,
    },
    {
      name: 'region',
      type: glue.Schema.STRING,
    },
  ],
  dataFormat: glue.DataFormat.JSON,
  partitionProjection: {
    year: glue.PartitionProjectionConfiguration.integer({
      min: 2020,
      max: 2023,
    }),
    month: glue.PartitionProjectionConfiguration.integer({
      min: 1,
      max: 12,
      digits: 2,
    }),
    region: glue.PartitionProjectionConfiguration.enum({
      values: ['us-east-1', 'us-west-2'],
    }),
  },
});

new IntegTest(app, 'GluePartitionProjectionTest', {
  testCases: [stack],
});
