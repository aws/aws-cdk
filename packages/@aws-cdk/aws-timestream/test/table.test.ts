import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { Bucket } from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Database, EncryptionOptions, Table } from '../lib';


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
      DatabaseName: {
        Ref: 'TestDatabase7A4A91C2',
      },
      TableName: 'testTable',
    });
  });

  test('table with all properties', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const bucket = new Bucket(stack, 'Bucket');
    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    new Table(stack, 'TestTable', {
      database,
      tableName: 'testTable',

      magneticWriteEnable: true,
      magneticWriteBucket: bucket,
      magneticWriteEncryptionOption: EncryptionOptions.SSE_S3,
      magneticWriteKey: key,
      magneticStoreRetentionPeriod: Duration.days(20),
      memoryStoreRetentionPeriod: Duration.days(1),

    });

    const expected: any = {
      DatabaseName: {
        Ref: 'TestDatabase7A4A91C2',
      },
      MagneticStoreWriteProperties: {
        magneticStoreRejectedDataLocation: {
          s3Configuration: {
            bucketName: {
              Ref: 'Bucket83908E77',
            },
            encryptionOption: 'SSE_S3',
            kmsKeyId: {
              Ref: 'TestKey4CACAF33',
            },
          },
        },
      },
      RetentionProperties: {
        memoryStoreRetentionPeriodInHours: '24',
        magneticStoreRetentionPeriodInDays: '20',
      },
      TableName: 'testTable',

    };

    Template.fromStack(stack).hasResourceProperties('AWS::Timestream::Table', expected);
  });

  test('table to throw when enablemagnetic is true but datalocation undefined', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    expect(() => new Table(stack, 'TestTable', {
      database,
      tableName: 'testTable',
      magneticWriteEnable: true,
    })).toThrowError('If enable for MagneticStoreWrites is true magneticWriteBucket must be defined.');
  });

  test('permission grant readWrite for table', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    const table = new Table(stack, 'TestTable', {
      database,
      tableName: 'testTable',
    });

    const role = new Role(stack, 'testrole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    table.grantReadWrite(role);

    const expected: any = {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'timestream:Select',
              'timestream:ListMeasures',
              'timestream:DescribeTable',
              'timestream:WriteRecords',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'TestTable5769773A',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    };

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', expected);

  });

  test('permission grant read for table', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    const table = new Table(stack, 'TestTable', {
      database,
      tableName: 'testTable',
    });

    const role = new Role(stack, 'testrole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    table.grantRead(role);

    const expected: any = {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'timestream:Select',
              'timestream:ListMeasures',
              'timestream:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'TestTable5769773A',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    };

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', expected);

  });

  test('table from arn', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const table = Table.fromTableArn(stack, 'ArnTestTable', 'arn:aws:timestream:us-east-1:457234467265:database/database/table/table');

    expect(table.tableName).toBe('table');
    expect(table.databaseName).toBe('database');
  });
});

