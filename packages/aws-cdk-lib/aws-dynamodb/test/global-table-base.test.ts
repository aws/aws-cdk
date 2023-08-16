import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { Alarm } from '../../aws-cloudwatch';
import { User } from '../../aws-iam';
import { Key } from '../../aws-kms';
import { Stack, StackProps, App } from '../../core';
import { GlobalTable, AttributeType, TableEncryptionV2, ITable, IGlobalTable, Operation } from '../lib';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';

function replicaResourceArns(replicaRegions: string[]) {
  const resourceArns: { [key: string]: any }[] = [];

  for (const replicaRegion of replicaRegions) {
    resourceArns.push({
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          `:dynamodb:${replicaRegion}:`,
          {
            Ref: 'AWS::AccountId',
          },
          ':table/',
          {
            Ref: 'Resource',
          },
        ],
      ],
    });
  }

  return resourceArns;
}

function replicaIndexArns(replicaRegions: string[]) {
  const indexArns: { [key: string]: any }[] = [];

  for (const replicaRegion of replicaRegions) {
    indexArns.push({
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          `:dynamodb:${replicaRegion}:`,
          {
            Ref: 'AWS::AccountId',
          },
          ':table/',
          {
            Ref: 'Resource',
          },
          '/index/*',
        ],
      ],
    });
  }

  return indexArns;
}

function replicaStreamArns(replicaRegions: string[]) {
  const streamArns: { [key: string]: any }[] = [];

  for (const replicaRegion of replicaRegions) {
    streamArns.push({
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          `:dynamodb:${replicaRegion}:`,
          {
            Ref: 'AWS::AccountId',
          },
          ':table/',
          {
            Ref: 'Resource',
          },
          '/stream/*',
        ],
      ],
    });
  }

  return streamArns;
}

function keyStatements(keyActions: string[], replicaKeyArns: { [region: string]: string }) {
  const statements: { [key: string]: any }[] = [];

  for (const replicaKeyArn of Object.values(replicaKeyArns)) {
    statements.push({
      Action: keyActions,
      Effect: 'Allow',
      Resource: replicaKeyArn,
    });
  }

  return statements;
}

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

/* eslint-disable no-console */
describe('grants', () => {
  test('grant with arbitrary actions on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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

  test('grantReadData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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

  test('grantReadData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
          ...keyStatements(
            [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            {
              'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
              'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
            },
          ),
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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
    testForKey(stack);
  });

  test('grantWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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

  test('grantWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
          ...keyStatements(
            [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            {
              'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
              'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
            },
          ),
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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
    testForKey(stack);
  });

  test('grantReadWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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

  test('grantReadWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
          ...keyStatements(
            [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            {
              'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
              'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
            },
          ),
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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
    testForKey(stack);
  });

  test('grantFullAccess on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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

  test('grantFullAccess on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
          ...keyStatements(
            [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            {
              'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
              'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
            },
          ),
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              { Ref: 'AWS::NoValue' },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
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
    testForKey(stack);
  });

  test('grant gives access to secondary indexes on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
                  'Resource',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Resource',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
              ...replicaResourceArns(['us-east-1', 'us-east-2']),
              ...replicaIndexArns(['us-east-1', 'us-east-2']),
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
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

  test('grantStreamRead on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
            ],
          },
          {
            Action: [
              'dynamodb:DescribeStream',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
            ],
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
            ],
          },
          ...keyStatements(
            [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            {
              'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
              'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
            },
          ),
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
            ],
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'StreamArn',
                ],
              },
              ...replicaStreamArns(['us-east-1', 'us-east-2']),
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

  test('grants for individual replica only has replica stream arn and replica key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
                    Ref: 'Resource',
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
                    Ref: 'Resource',
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
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
            Resource: [
              {
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
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                Ref: 'AWS::NoValue',
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
    testForKey(stack);
  });

  test('can grant to replica in different stack when table name not provided', () => {
    class FooStack extends Stack {
      public readonly globalTable: GlobalTable;

      public constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.globalTable = new GlobalTable(this, 'GlobalTable', {
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
            Resource: [
              {
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
              {
                Ref: 'AWS::NoValue',
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

  test('can grant with a global table imported by name', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const globalTable = GlobalTable.fromTableName(stack, 'GlobalTable', 'my-global-table');

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
                    ':table/my-global-table',
                  ],
                ],
              },
              {
                Ref: 'AWS::NoValue',
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

  test('can grant with a global table imported by arn', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const globalTable = GlobalTable.fromTableArn(stack, 'GlobalTable', 'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table');

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
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
              {
                Ref: 'AWS::NoValue',
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

  test('can grant with a global table imported with an encryption key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const tableKey = new Key(stack, 'Key');
    const globalTable = GlobalTable.fromTableAttributes(stack, 'GlobalTable', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
      encryptionKey: tableKey,
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
            Resource: [
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
              {
                Ref: 'AWS::NoValue',
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

  test('can grant with a global table imported with secondary index permission', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const globalTable = GlobalTable.fromTableAttributes(stack, 'GlobalTable', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
      grantIndexPermissions: true,
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
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table/index/*',
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

  test('can grant with a global table imported with secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const user = new User(stack, 'User');
    const globalTable = GlobalTable.fromTableAttributes(stack, 'GlobalTable', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
      globalIndexes: ['gsi'],
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
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table',
              'arn:aws:dynamodb:us-east-2:123456789012:table/my-global-table/index/*',
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
    const globalTable = GlobalTable.fromTableName(stack, 'GlobalTable', 'my-global-table');

    // WHEN / THEN
    expect(() => {
      globalTable.grantStreamRead(user);
    }).toThrow('No stream ARNs found on the table Stack/GlobalTable');
  });
});

describe('metrics', () => {
  test('can use metricConsumedReadCapacityUnits on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricConsumedReadCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: {
          Ref: 'Resource',
        },
      },
      namespace: 'AWS/DynamoDB',
      metricName: 'ConsumedReadCapacityUnits',
      statistic: 'Sum',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can use metricConsumedWriteCapacityUnits on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricConsumedWriteCapacityUnits())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: {
        TableName: {
          Ref: 'Resource',
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(Object.keys(globalTable.metricSystemErrorsForOperations().toMetricConfig().mathExpression!.usingMetrics)).toEqual([
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

  test('can use metricSystemErrorsForOperations on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricSystemErrorsForOperations({ operations: [Operation.GET_ITEM, Operation.PUT_ITEM] }))).toEqual({
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
              Ref: 'Resource',
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
              Ref: 'Resource',
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

  test('can use metricUserErrors on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricUserErrors())).toEqual({
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

  test('can use metricConditionalCheckFailedRequests on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricConditionalCheckFailedRequests())).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'Resource' } },
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(globalTable.metricSuccessfulRequestLatency({ dimensionsMap: { Operation: 'GetItem' } }).dimensions).toEqual({
      TableName: globalTable.tableName,
      Operation: 'GetItem',
    });
  });

  test('can use metricSuccessfulRequestLatency on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricSuccessfulRequestLatency({
      dimensionsMap: { TableName: globalTable.tableName, Operation: 'GetItem' },
    }))).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'Resource' }, Operation: 'GetItem' },
      namespace: 'AWS/DynamoDB',
      metricName: 'SuccessfulRequestLatency',
      statistic: 'Average',
      account: { Ref: 'AWS::AccountId' },
      region: { Ref: 'AWS::Region' },
    });
  });

  test('can configure alarm with global table configured in a different stack', () => {
    class FooStack extends Stack {
      public readonly globalTable: GlobalTable;

      public constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.globalTable = new GlobalTable(this, 'GlobalTable', {
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          replicas: [{ region: 'us-east-1' }],
        });
      }
    }

    interface BarStackProps extends StackProps {
      readonly replicaTable: IGlobalTable;
    }

    class BarStack extends Stack {
      public constructor(scope: Construct, id: string, props: BarStackProps) {
        super(scope, id, props);

        const metric = props.replicaTable.metricConsumedReadCapacityUnits();
        console.log(this.resolve(metric));
        new Alarm(this, 'ReadCapacityAlarm', {
          metric,
          evaluationPeriods: 1,
          threshold: 1,
        });
      }
    }

    const app = new App();
    const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2', account: '123456789012' } });
    new BarStack(app, 'BarStack', {
      replicaTable: fooStack.globalTable.replica('us-east-1'),
    });
  });

  testDeprecated('can use metricSystemErrors without TableName dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(globalTable.metricSystemErrors({ dimensions: { Operation: 'GetItem' } }).dimensions).toEqual({
      TableName: globalTable.tableName,
      Operation: 'GetItem',
    });
  });

  testDeprecated('can use metricSystemErrors on a global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(stack.resolve(globalTable.metricSystemErrors({ dimensionsMap: { TableName: globalTable.tableName, Operation: 'GetItem' } }))).toEqual({
      period: {
        amount: 5,
        unit: { label: 'minutes', isoLabel: 'M', inMillis: 60000 },
      },
      dimensions: { TableName: { Ref: 'Resource' }, Operation: 'GetItem' },
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
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      globalTable.metricUserErrors({ dimensions: { TableName: globalTable.tableName } });
    }).toThrow('`dimensions` is not supported for the `UserErrors` metric');
  });

  test('throws when using metricSuccessfulRequestLatency without Operation dimension', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      globalTable.metricSuccessfulRequestLatency({ dimensionsMap: { TableName: globalTable.tableName } });
    }).toThrow('`Operation` dimension must be passed for the `SuccessfulRequestLatency` metric');
  });

  testDeprecated('throws when using metricSystemErrors without Operation dimension', () => {});
});
