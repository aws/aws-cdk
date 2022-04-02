import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { Bucket } from '@aws-cdk/aws-s3';
import { Topic } from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import { Database, EncryptionOptions, ScheduledQuery, Table } from '../lib';


describe('Timestream Database', () => {
  test('database is created', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Timestream::Database', {
      DatabaseName: 'Database_1',
    });
  });

  test('database from arn', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    Database.fromDatabaseArn(stack, 'ArnTestDatabase', 'arn:aws:timestream:us-east-1:123456789012:database/database');

    // Template.fromStack(stack).hasResourceProperties('AWS::Timestream::Database', {

    // });
  });
});

describe('Timestream Table', () => {
  test('table is created', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    new Table(stack, 'TestTable', {
      database,
      tableName: 'testTable',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Timestream::Table', {
      TableName: 'testTable',
      DatabaseName: 'Database_1',
    });
  });

  test('table from arn', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const table = Table.fromTableArn(stack, 'ArnTestTable', 'arn:aws:timestream:us-east-1:457234467265:database/database/table/table');

    expect(table.tableName).toBe('table');
    expect(table.databaseName).toBe('database');
  });
});

describe('Timestream Scheduled Query', () => {
  test('', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const bucket = new Bucket(stack, 'TestBucket');
    const topic = new Topic(stack, 'TestTopic');
    const database = new Database(stack, 'TestDatabase');
    const table = new Table(stack, 'TestTable', { database });
    const role = new Role(stack, 'TestRole', {
      assumedBy: new ServicePrincipal('timestream.amazonaws.com'),
    });


    new ScheduledQuery(stack, 'SQ_1', {
      queryString: 'SELECT * FROM DATABASE',
      errorReportConfiguration: {
        s3Configuration: {
          bucketName: bucket.bucketName,
          encryptionOption: EncryptionOptions.SSE_S3,
          objectKeyPrefix: 'prefix/',
        },
      },
      scheduledQueryName: 'Test Query',
      notificationConfiguration: {
        snsConfiguration: {
          topicArn: topic.topicArn,
        },
      },
      targetConfiguration: {
        timestreamConfiguration: {
          databaseName: database.databaseName,
          dimensionMappings: [
            { dimensionValueType: 'VARCHAR', name: 'region' },
          ],
          tableName: table.tableName,
          timeColumn: 'hour',

        },
      },
      scheduleConfiguration: {
        scheduleExpression: '',
      },
      scheduledQueryExecutionRole: role,
    });
  });
});