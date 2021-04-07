import '@aws-cdk/assert-internal/jest';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import { RemovalPolicy, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BackupPlan, BackupResource, BackupSelection } from '../lib';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

let stack: Stack;
let plan: BackupPlan;
beforeEach(() => {
  stack = new Stack();
  plan = BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'Plan');
});

test('create a selection', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
      BackupResource.fromArn('arn2'),
      BackupResource.fromTag('stage', 'prod'),
      BackupResource.fromTag('cost center', 'cloud'),
    ],
  });

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupSelection', {
    BackupPlanId: {
      'Fn::GetAtt': [
        'PlanDAF4E53A',
        'BackupPlanId',
      ],
    },
    BackupSelection: {
      IamRoleArn: {
        'Fn::GetAtt': [
          'SelectionRoleD0EAEC83',
          'Arn',
        ],
      },
      ListOfTags: [
        {
          ConditionKey: 'stage',
          ConditionType: 'STRINGEQUALS',
          ConditionValue: 'prod',
        },
        {
          ConditionKey: 'cost center',
          ConditionType: 'STRINGEQUALS',
          ConditionValue: 'cloud',
        },
      ],
      Resources: [
        'arn1',
        'arn2',
      ],
      SelectionName: 'Selection',
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup',
          ],
        ],
      },
    ],
  });
});

test('allow restores', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    allowRestores: true,
  });

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup',
          ],
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
            ':iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores',
          ],
        ],
      },
    ],
  });
});

test('fromConstruct', () => {
  // GIVEN
  class EfsConstruct extends CoreConstruct {
    constructor(scope: Construct, id: string) {
      super(scope, id);
      const fs = new efs.CfnFileSystem(this, 'FileSystem');
      fs.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
  }
  class MyConstruct extends CoreConstruct {
    constructor(scope: Construct, id: string) {
      super(scope, id);

      new dynamodb.Table(this, 'Table', {
        partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING,
        },
      });

      new EfsConstruct(this, 'EFS');
    }
  }
  const myConstruct = new MyConstruct(stack, 'MyConstruct');
  const efsConstruct = new EfsConstruct(stack, 'EfsConstruct');

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromConstruct(myConstruct),
      BackupResource.fromConstruct(efsConstruct),
    ],
  });

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupSelection', {
    BackupSelection: {
      IamRoleArn: {
        'Fn::GetAtt': [
          'PlanSelectionRole6D10F4B7',
          'Arn',
        ],
      },
      Resources: [
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
              ':table/',
              {
                Ref: 'MyConstructTable25959456',
              },
            ],
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
              ':elasticfilesystem:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':file-system/',
              {
                Ref: 'MyConstructEFSFileSystemC68B6B78',
              },
            ],
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
              ':elasticfilesystem:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':file-system/',
              {
                Ref: 'EfsConstructFileSystemFBE43F88',
              },
            ],
          ],
        },
      ],
      SelectionName: 'Selection',
    },
  });
});

test('fromEc2Instance', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
    machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  });

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromEc2Instance(instance),
    ],
  });

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupSelection', {
    BackupSelection: {
      IamRoleArn: {
        'Fn::GetAtt': [
          'PlanSelectionRole6D10F4B7',
          'Arn',
        ],
      },
      Resources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':ec2:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':instance/',
              {
                Ref: 'InstanceC1063A87',
              },
            ],
          ],
        },
      ],
      SelectionName: 'Selection',
    },
  });
});

test('fromDynamoDbTable', () => {
  // GIVEN
  const newTable = new dynamodb.Table(stack, 'New', {
    partitionKey: {
      name: 'id',
      type: dynamodb.AttributeType.STRING,
    },
  });
  const existingTable = dynamodb.Table.fromTableArn(stack, 'Existing', 'arn:aws:dynamodb:eu-west-1:123456789012:table/existing');

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromDynamoDbTable(newTable),
      BackupResource.fromDynamoDbTable(existingTable),
    ],
  });

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupSelection', {
    BackupSelection: {
      IamRoleArn: {
        'Fn::GetAtt': [
          'PlanSelectionRole6D10F4B7',
          'Arn',
        ],
      },
      Resources: [
        {
          'Fn::GetAtt': [
            'New8A81B073',
            'Arn',
          ],
        },
        'arn:aws:dynamodb:eu-west-1:123456789012:table/existing',
      ],
      SelectionName: 'Selection',
    },
  });
});
