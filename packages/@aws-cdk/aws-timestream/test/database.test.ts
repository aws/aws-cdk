import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { App, Stack } from '@aws-cdk/core';
import { Database } from '../lib';


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

  test('database errors when name below 3 chars', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    expect(() => new Database(stack, 'TestDatabase', {
      databaseName: 'Da',
      kmsKey: key,
    })).toThrow('Database name must have between 3 and 256 characters or omitted. Received: Da');
  });

  test('database is created with default key', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');


    new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Timestream::Database', {
      DatabaseName: 'Database_1',
    });
  });

  test('database from arn', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const database = Database.fromDatabaseArn(stack, 'ArnTestDatabase', 'arn:aws:timestream:us-east-1:123456789012:database/database');

    expect(database.databaseName).toBe('database');
  });

  test('permission grant readWrite for database', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });


    const role = new Role(stack, 'testrole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    database.grantReadWrite(role);

    const expected: any = {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'timestream:Select',
              'timestream:ListMeasures',
              'timestream:DescribeTable',
              'timestream:WriteRecords',
              'timestream:ListTables',
              'timestream:DescribeDatabase',
              'timestream:CreateTable',
              'timestream:DeleteTable',
              'timestream:UpdateTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'TestDatabase7A4A91C2',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':timestream:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':database/',
                    {
                      Ref: 'TestDatabase7A4A91C2',
                    },
                    '/table/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    };

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', expected);

  });


  test('permission grant read for database', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const key = new Key(stack, 'TestKey');

    const database = new Database(stack, 'TestDatabase', {
      databaseName: 'Database_1',
      kmsKey: key,
    });

    const role = new Role(stack, 'testrole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    database.grantRead(role);

    const expected: any = {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'timestream:Select',
              'timestream:ListMeasures',
              'timestream:DescribeTable',
              'timestream:WriteRecords',
              'timestream:ListTables',
              'timestream:DescribeDatabase',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'TestDatabase7A4A91C2',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':timestream:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':database/',
                    {
                      Ref: 'TestDatabase7A4A91C2',
                    },
                    '/table/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    };

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', expected);

  });
});

