import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { Alarm, Metric } from '../../aws-cloudwatch';
import { User } from '../../aws-iam';
import { Key } from '../../aws-kms';
import { Stack, StackProps, App } from '../../core';
import { TableV2, AttributeType, TableEncryptionV2, ITable, ITableV2, Operation } from '../lib';

function testForKey(stack: Stack) {
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [
        {
          Action: 'kms:*',
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
}

describe('grants', () => {
  test('grant with arbitrary actions', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grant(user, 'dynamodb:action1', 'dynamodb:action2');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['dynamodb:action1', 'dynamodb:action2'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadData with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('grantWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('grantReadWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('grantFullAccess on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantFullAccess(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:*',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantFullAccess on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantFullAccess(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: 'dynamodb:*',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('grant gives access to secondary indexes on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
        },
      ],
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'GlobalTable89F068B2',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'GlobalTable89F068B2',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantStream on global table with arbitrary actions', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantStream(user, 'dynamodb:StreamAction1', 'dynamodb:StreamAction2');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:StreamAction1',
              'dynamodb:StreamAction2',
            ],
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantStreamRead on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'Stack');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantStreamRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:ListStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:DescribeStream',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantStreamRead on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'Stack');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantStreamRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:ListStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:DescribeStream',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
    testForKey(stack);
  });

  test('grantTableListStreams on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantTableListStreams(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:ListStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'GlobalTable89F068B2',
                'StreamArn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grants for individual replica only has replica stream arn and replica key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.replica('us-east-1').grantStreamRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'dynamodb:ListStreams',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':dynamodb:us-east-1:',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':table/',
                  {
                    Ref: 'GlobalTable89F068B2',
                  },
                  '/stream/*',
                ],
              ],
            },
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'dynamodb:DescribeStream',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':dynamodb:us-east-1:',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':table/',
                  {
                    Ref: 'GlobalTable89F068B2',
                  },
                  '/stream/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('grants for individual replica only has replica arn and replica key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.replica('us-east-1').grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':dynamodb:us-east-1:',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':table/',
                  {
                    Ref: 'GlobalTable89F068B2',
                  },
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
    testForKey(stack);
  });

  test('can grant to replica in different stack when table name not provided', () => {
    class FooStack extends Stack {
      public readonly globalTable: TableV2;

      public constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.globalTable = new TableV2(this, 'GlobalTable', {
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          replicas: [
            { region: 'us-east-1' },
            { region: 'us-east-2' },
          ],
        });
      }
    }

    interface BarStackProps extends StackProps {
      readonly replicaTable: ITable;
    }

    class BarStack extends Stack {
      public constructor(scope: Construct, id: string, props: BarStackProps) {
        super(scope, id, props);

        const user = new User(this, 'User');

        props.replicaTable.grantReadData(user);
      }
    }

    const app = new App();

    const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2', account: '123456789012' } });
    const barStack = new BarStack(app, 'BarStack', {
      replicaTable: fooStack.globalTable.replica('us-east-1'),
    });

    Template.fromStack(barStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':dynamodb:us-east-1:123456789012:table/foostackstackglobaltableb6dd9d1a6f2b84889e59',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant with a table imported by name', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const table = TableV2.fromTableName(stack, 'Table', 'my-table');

    // WHEN
    table.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':dynamodb:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':table/my-table',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant with a table imported by arn', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const table = TableV2.fromTableArn(stack, 'Table', 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table');

    // WHEN
    table.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant with a table imported with an encryption key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const tableKey = new Key(stack, 'Key');
    const table = TableV2.fromTableAttributes(stack, 'Table', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
      encryptionKey: tableKey,
    });

    // WHEN
    table.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant with a table imported with secondary index permission', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const table = TableV2.fromTableAttributes(stack, 'Table', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
      grantIndexPermissions: true,
    });

    // WHEN
    table.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-table/index/*',
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant with a table imported with secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const table = TableV2.fromTableAttributes(stack, 'Table', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
      globalIndexes: ['gsi'],
    });

    // WHEN
    table.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-table/index/*',
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('throws if table stream arn is missing when granting for table stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const table = TableV2.fromTableName(stack, 'Table', 'my-table');

    // WHEN / THEN
    expect(() => {
      table.grantStreamRead(user);
    }).toThrow('No stream ARN found on the table Stack/Table');
  });
});

describe('metrics', () => {
  test('can use metricConsumedReadCapacityUnits on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricConsumedReadCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: {
          Ref: 'TableCD117FA1',
        },
      },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metricConsumedWriteCapacityUnits on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricConsumedWriteCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: {
          Ref: 'TableCD117FA1',
        },
      },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedWriteCapacityUnits',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('using metricSystemErrorsForOperations with no operations will default to all', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(Object.keys(table.metricSystemErrorsForOperations().toMetricConfig().mathExpression!.usingMetrics)).toEqual([
      'getitem',
      'batchgetitem',
      'scan',
      'query',
      'getrecords',
      'putitem',
      'deleteitem',
      'updateitem',
      'batchwriteitem',
      'transactwriteitems',
      'transactgetitems',
      'executetransaction',
      'batchexecutestatement',
      'executestatement',
    ]);
  });

  test('can use metricSystemErrorsForOperations on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricSystemErrorsForOperations({ operations: [Operation.GET_ITEM, Operation.PUT_ITEM] }))).toEqual({
      expression: 'getitem + putitem',
      label: 'Sum of errors across all operations',
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      usingMetrics: {
        getitem: {
          account: { Ref: 'AWS::AccountId' },
          region: { Ref: 'AWS::Region' },
          dimensions: {
            Operation: 'GetItem',
            TableName: {
              Ref: 'TableCD117FA1',
            },
          },
          metricName: 'SystemErrors',
          namespace: 'AWS/DynamoDB',
          period: {
            amount: 5,
            unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
          },
          statistic: 'Sum',
        },
        putitem: {
          account: { Ref: 'AWS::AccountId' },
          region: { Ref: 'AWS::Region' },
          dimensions: {
            Operation: 'PutItem',
            TableName: {
              Ref: 'TableCD117FA1',
            },
          },
          metricName: 'SystemErrors',
          namespace: 'AWS/DynamoDB',
          period: {
            amount: 5,
            unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
          },
          statistic: 'Sum',
        },
      },
    });
  });

  test('can use metricUserErrors on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricUserErrors())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {},
      namespace: 'AWS/DynamoDB',
      metricName: 'UserErrors',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metricConditionalCheckFailedRequests on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricConditionalCheckFailedRequests())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'TableCD117FA1' } },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConditionalCheckFailedRequests',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metricSuccessfulRequestLatency without TableName dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(table.metricSuccessfulRequestLatency({ dimensionsMap: { Operation: 'GetItem' } }).dimensions).toEqual({
      TableName: table.tableName,
      Operation: 'GetItem',
    });
  });

  test('can use metricSuccessfulRequestLatency on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricSuccessfulRequestLatency({
      dimensionsMap: { TableName: table.tableName, Operation: 'GetItem' },
    }))).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'TableCD117FA1' }, Operation: 'GetItem' },
      namespace: 'AWS/DynamoDB',
      metricName: 'SuccessfulRequestLatency',
      statistic: 'Average',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metricThrottledRequestsForOperation on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricThrottledRequestsForOperation(Operation.PUT_ITEM))).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      metricName: 'ThrottledRequests',
      dimensions: { TableName: { Ref: 'TableCD117FA1' }, Operation: 'PutItem' },
      namespace: 'AWS/DynamoDB',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
      statistic: 'Sum',
    });
  });

  test('can use metricThrottledRequestForOperations on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricThrottledRequestsForOperations({ operations: [Operation.GET_ITEM, Operation.PUT_ITEM] }))).toEqual({
      expression: 'getitem + putitem',
      label: 'Sum of throttled requests across all operations',
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      usingMetrics: {
        getitem: {
          account: { Ref: 'AWS::AccountId' },
          region: { Ref: 'AWS::Region' },
          dimensions: {
            Operation: 'GetItem',
            TableName: {
              Ref: 'TableCD117FA1',
            },
          },
          metricName: 'ThrottledRequests',
          namespace: 'AWS/DynamoDB',
          period: {
            amount: 5,
            unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
          },
          statistic: 'Sum',
        },
        putitem: {
          account: { Ref: 'AWS::AccountId' },
          region: { Ref: 'AWS::Region' },
          dimensions: {
            Operation: 'PutItem',
            TableName: {
              Ref: 'TableCD117FA1',
            },
          },
          metricName: 'ThrottledRequests',
          namespace: 'AWS/DynamoDB',
          period: {
            amount: 5,
            unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
          },
          statistic: 'Sum',
        },
      },
    });
  });

  test('can use metrics on a table imported by name', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = TableV2.fromTableName(stack, 'Table', 'my-table');

    // WHEN / THEN
    expect(stack.resolve(table.metricConsumedReadCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: 'my-table',
      },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metrics on a table imported by arn', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = TableV2.fromTableArn(stack, 'Table', 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table');

    // WHEN / THEN
    expect(stack.resolve(table.metricConsumedReadCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: 'my-table',
      },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: 'us-east-2',
    });
  });

  test('can configure alarm with global table configured in a different stack', () => {
    class FooStack extends Stack {
      public readonly globalTable: TableV2;

      public constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.globalTable = new TableV2(this, 'GlobalTable', {
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          replicas: [{ region: 'us-east-1' }],
        });
      }
    }

    interface BarStackProps extends StackProps {
      readonly replicaTable: ITableV2;
    }

    class BarStack extends Stack {
      public readonly metric: Metric;

      public constructor(scope: Construct, id: string, props: BarStackProps) {
        super(scope, id, props);

        this.metric = props.replicaTable.metricConsumedReadCapacityUnits();
        new Alarm(this, 'ReadCapacityAlarm', {
          metric: this.metric,
          evaluationPeriods: 1,
          threshold: 1,
        });
      }
    }

    const app = new App();
    const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2', account: '123456789012' } });
    const barStack = new BarStack(app, 'BarStack', {
      replicaTable: fooStack.globalTable.replica('us-east-1'),
    });

    expect(barStack.resolve(barStack.metric)).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: 'foostackstackglobaltableb6dd9d1a6f2b84889e59' },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      statistic: 'Sum',
      account: '123456789012',
      region: 'us-east-1',
    });
    Template.fromStack(barStack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      Metrics: [
        {
          AccountId: '123456789012',
          Id: 'm1',
          MetricStat: {
            Metric: {
              Dimensions: [
                {
                  Name: 'TableName',
                  Value: 'foostackstackglobaltableb6dd9d1a6f2b84889e59',
                },
              ],
              MetricName: 'ConsumedReadCapacityUnits',
              Namespace: 'AWS/DynamoDB',
            },
            Period: 300,
            Stat: 'Sum',
          },
          ReturnData: true,
        },
      ],
      Threshold: 1,
    });
  });

  testDeprecated('can use metricThrottledRequests on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricThrottledRequests())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'TableCD117FA1' } },
      namespace: 'AWS/DynamoDB',
      metricName: 'ThrottledRequests',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  testDeprecated('can use metricSystemErrors without TableName dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(table.metricSystemErrors({ dimensions: { Operation: 'GetItem' } }).dimensions).toEqual({
      TableName: table.tableName,
      Operation: 'GetItem',
    });
  });

  testDeprecated('can use metricSystemErrors on a table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(table.metricSystemErrors({ dimensionsMap: { TableName: table.tableName, Operation: 'GetItem' } }))).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'TableCD117FA1' }, Operation: 'GetItem' },
      namespace: 'AWS/DynamoDB',
      metricName: 'SystemErrors',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('throws when using metricUserErrors with dimensions', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.metricUserErrors({ dimensions: { TableName: table.tableName } });
    }).toThrow('`dimensions` is not supported for the `UserErrors` metric');
  });

  test('throws when using metricSuccessfulRequestLatency without Operation dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.metricSuccessfulRequestLatency({ dimensionsMap: { TableName: table.tableName } });
    }).toThrow('`Operation` dimension must be passed for the `SuccessfulRequestLatency` metric');
  });

  testDeprecated('throws when using metricSystemErrors without Operation dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.metricSystemErrors({ dimensions: { TableName: table.tableName } });
    }).toThrow("'Operation' dimension must be passed for the 'SystemErrors' metric.");
  });
});
