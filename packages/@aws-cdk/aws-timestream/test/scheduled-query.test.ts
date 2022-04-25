import { Template } from '@aws-cdk/assertions';
import { Schedule } from '@aws-cdk/aws-events';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { Topic } from '@aws-cdk/aws-sns';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Database, EncryptionOptions, ScheduledQuery, Table } from '../lib';


describe('Timestream Scheduled Query', () => {
  test('Scheduled Query is created', () => {
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
          bucket: bucket,
          encryptionOption: EncryptionOptions.SSE_S3,
          objectKeyPrefix: 'prefix/',
        },
      },
      scheduledQueryName: 'Test Query',
      notificationConfiguration: {
        snsConfiguration: {
          topic: topic,
        },
      },
      targetConfiguration: {
        timestreamConfiguration: {
          dimensionMappings: [
            { dimensionValueType: 'VARCHAR', name: 'region' },
          ],
          table,
          timeColumn: 'hour',
        },
      },
      schedule: Schedule.rate(Duration.days(1)),
      scheduledQueryExecutionRole: role,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Timestream::ScheduledQuery', {
      ErrorReportConfiguration: {
        S3Configuration: {
          BucketName: {
            Ref: 'TestBucket560B80BC',
          },
          EncryptionOption: 'SSE_S3',
          ObjectKeyPrefix: 'prefix/',
        },
      },
      NotificationConfiguration: {
        SnsConfiguration: {
          TopicArn: {
            Ref: 'TestTopic339EC197',
          },
        },
      },
      QueryString: 'SELECT * FROM DATABASE',
      ScheduleConfiguration: {
        ScheduleExpression: 'rate(1 day)',
      },
      ScheduledQueryExecutionRoleArn: {
        'Fn::GetAtt': [
          'TestRole6C9272DF',
          'Arn',
        ],
      },
      ScheduledQueryName: 'Test Query',
      TargetConfiguration: {
        TimestreamConfiguration: {
          DatabaseName: {
            Ref: 'TestDatabase7A4A91C2',
          },
          DimensionMappings: [
            {
              DimensionValueType: 'VARCHAR',
              Name: 'region',
            },
          ],
          TableName: {
            'Fn::GetAtt': [
              'TestTable5769773A',
              'Name',
            ],
          },
          TimeColumn: 'hour',
        },
      },
    });
  });

  test('Scheduled Query role is created', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const bucket = new Bucket(stack, 'TestBucket');
    const topic = new Topic(stack, 'TestTopic');
    const database = new Database(stack, 'TestDatabase');
    const table = new Table(stack, 'TestTable', { database });

    new ScheduledQuery(stack, 'SQ_1', {
      queryString: 'SELECT * FROM DATABASE',
      errorReportConfiguration: {
        s3Configuration: {
          bucket: bucket,
          encryptionOption: EncryptionOptions.SSE_S3,
          objectKeyPrefix: 'prefix/',
        },
      },
      scheduledQueryName: 'Test Query',
      notificationConfiguration: {
        snsConfiguration: {
          topic: topic,
        },
      },
      schedule: Schedule.rate(Duration.days(1)),
      sourceTable: table,
    });

    const expected = {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TestTopic339EC197',
            },
          },
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'TestBucket560B80BC',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'TestBucket560B80BC',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
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

  test('Scheduled Query role is created with two tables least privilege', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const bucket = new Bucket(stack, 'TestBucket');
    const topic = new Topic(stack, 'TestTopic');
    const database = new Database(stack, 'TestDatabase');
    const table = new Table(stack, 'TestTable', { database });
    const table2 = new Table(stack, 'TestTable2', { database });

    new ScheduledQuery(stack, 'SQ_1', {
      queryString: 'SELECT * FROM DATABASE',
      errorReportConfiguration: {
        s3Configuration: {
          bucket: bucket,
          encryptionOption: EncryptionOptions.SSE_S3,
          objectKeyPrefix: 'prefix/',
        },
      },
      targetConfiguration: {
        timestreamConfiguration: {
          dimensionMappings: [
            { dimensionValueType: 'VARCHAR', name: 'region' },
          ],
          table: table2,
          timeColumn: 'hour',
        },
      },
      scheduledQueryName: 'Test Query',
      notificationConfiguration: {
        snsConfiguration: {
          topic: topic,
        },
      },
      schedule: Schedule.rate(Duration.days(1)),
      sourceTable: table,
    });

    const expected = {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sns:Publish',
            Effect: 'Allow',
            Resource: {
              Ref: 'TestTopic339EC197',
            },
          },
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
                'TestTable2BDBB502F',
                'Arn',
              ],
            },
          },
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'TestBucket560B80BC',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'TestBucket560B80BC',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
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

  test('Scheduled Query role errors', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const bucket = new Bucket(stack, 'TestBucket');
    const topic = new Topic(stack, 'TestTopic');

    expect(() => new ScheduledQuery(stack, 'SQ_1', {
      queryString: 'SELECT * FROM DATABASE',
      errorReportConfiguration: {
        s3Configuration: {
          bucket: bucket,
          encryptionOption: EncryptionOptions.SSE_S3,
          objectKeyPrefix: 'prefix/',
        },
      },
      scheduledQueryName: 'Test Query',
      notificationConfiguration: {
        snsConfiguration: {
          topic: topic,
        },
      },
      schedule: Schedule.rate(Duration.days(1)),
    })).toThrow('Neither sourceTable nor TargetConfiguration are set, cannot determine correct permissions, please supply scheduledQueryExecutionRole');


  });
});

