import { Schedule } from '@aws-cdk/aws-events';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { Bucket } from '@aws-cdk/aws-s3';
import { Topic } from '@aws-cdk/aws-sns';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Database, EncryptionOptions, ScheduledQuery, Table } from '../lib';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

const app = new App();
const stack = new Stack(app, 'aws-timestream-scheduled-query-integ', { env });

const key = new Key(stack, 'TestKey');
const database = new Database(stack, 'TestDatabase', { databaseName: 'ATestDB', kmsKey: key });
const table = new Table(stack, 'TestTable', { database, tableName: 'Test' });
const bucket = new Bucket(stack, 'TestBucket', {
  autoDeleteObjects: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
const topic = new Topic(stack, 'TestTopic');
const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('timestream.amazonaws.com'),
});

bucket.grantReadWrite(role);
topic.grantPublish(role);

new ScheduledQuery(stack, 'ScheduledQuery', {
  queryString: 'SELECT time, measure_name as name, measure_name as amount FROM "ATestDB"."Test"',
  errorReportBucket: bucket,
  errorReportEncryptionOption: EncryptionOptions.SSE_S3,
  errorReportObjectKeyPrefix: 'prefix/',
  scheduledQueryName: 'Test_Query',
  notificationTopic: topic,
  targetConfiguration: {

    dimensionMappings: [{
      name: 'name',
      dimensionValueType: 'VARCHAR',
    }],
    multiMeasureMappings: {
      targetMultiMeasureName: 'test',
      multiMeasureAttributeMappings: [{
        measureValueType: 'VARCHAR',
        sourceColumn: 'amount',
      }],
    },
    table,
    timeColumn: 'time',
  },
  schedule: Schedule.cron({ minute: '30' }),
  executionRole: role,
});

app.synth();