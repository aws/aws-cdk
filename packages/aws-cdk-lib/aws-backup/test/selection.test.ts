import { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import * as dynamodb from '../../aws-dynamodb';
import * as ec2 from '../../aws-ec2';
import * as efs from '../../aws-efs';
import * as rds from '../../aws-rds';
import { RemovalPolicy, Stack } from '../../core';
import { BackupPlan, BackupResource, BackupSelection } from '../lib';

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
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

test('no policy is attached if disableDefaultBackupPolicy is true', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    disableDefaultBackupPolicy: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns: Match.absent(),
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
  class EfsConstruct extends Construct {
    constructor(scope: Construct, id: string) {
      super(scope, id);
      const fs = new efs.CfnFileSystem(this, 'FileSystem');
      fs.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
  }
  class MyConstruct extends Construct {
    constructor(scope: Construct, id: string) {
      super(scope, id);

      new dynamodb.Table(this, 'Table', {
        partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING,
        },
      });

      new EfsConstruct(this, 'EFS');

      const vpc = new ec2.Vpc(this, 'Vpc');

      new rds.DatabaseInstance(this, 'DatabaseInstance', {
        engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_26 }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
        vpc,
      });

      new rds.DatabaseCluster(this, 'DatabaseCluster', {
        engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
        credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
        instanceProps: {
          vpc,
        },
      });

      new rds.ServerlessCluster(this, 'ServerlessCluster', {
        engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql11'),
        vpc,
      });
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
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':db:',
              {
                Ref: 'MyConstructDatabaseInstanceC3164567',
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:',
              {
                Ref: 'MyConstructDatabaseCluster9BAC1530',
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:',
              {
                Ref: 'MyConstructServerlessCluster90C61A45',
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
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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

test('fromRdsDatabaseInstance', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const newInstance = new rds.DatabaseInstance(stack, 'New', {
    engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_26 }),
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpc,
  });
  const existingInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Existing', {
    instanceEndpointAddress: 'address',
    instanceIdentifier: 'existing-instance',
    port: 3306,
    securityGroups: [],
  });

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromRdsDatabaseInstance(newInstance),
      BackupResource.fromRdsDatabaseInstance(existingInstance),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':db:',
              {
                Ref: 'New8A81B073',
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':db:existing-instance',
            ],
          ],
        },
      ],
      SelectionName: 'Selection',
    },
  });
});

test('fromRdsDatabaseCluster', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const newCluster = new rds.DatabaseCluster(stack, 'New', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
    credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
    instanceProps: {
      vpc,
    },
  });
  const existingCluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Existing', {
    clusterIdentifier: 'existing-cluster',
  });

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromRdsDatabaseCluster(newCluster),
      BackupResource.fromRdsDatabaseCluster(existingCluster),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:',
              {
                Ref: 'New8A81B073',
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:existing-cluster',
            ],
          ],
        },
      ],
      SelectionName: 'Selection',
    },
  });
});

test('fromRdsServerlessCluster', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const newCluster = new rds.ServerlessCluster(stack, 'New', {
    engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
    parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql11'),
    vpc,
  });
  const existingCluster = rds.ServerlessCluster.fromServerlessClusterAttributes(stack, 'Existing', {
    clusterIdentifier: 'existing-cluster',
  });

  // WHEN
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromRdsServerlessCluster(newCluster),
      BackupResource.fromRdsServerlessCluster(existingCluster),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:',
              {
                Ref: 'New8A81B073',
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
              ':rds:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster:existing-cluster',
            ],
          ],
        },
      ],
      SelectionName: 'Selection',
    },
  });
});

test('conditions with stringEquals', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
    ],
    conditions: {
      stringEquals: [
        { key: 'aws-backup', value: '1' },
      ],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn:aws:ec2:*:*:volume/*',
      ],
      Conditions: {
        StringEquals: [
          {
            ConditionKey: 'aws:ResourceTag/aws-backup',
            ConditionValue: '1',
          },
        ],
      },
    },
  });
});

test('conditions with all operation types', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
    ],
    conditions: {
      stringEquals: [
        { key: 'environment', value: 'production' },
      ],
      stringLike: [
        { key: 'project', value: 'my-project-*' },
      ],
      stringNotEquals: [
        { key: 'temporary', value: 'true' },
      ],
      stringNotLike: [
        { key: 'name', value: 'test-*' },
      ],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn:aws:ec2:*:*:volume/*',
      ],
      Conditions: {
        StringEquals: [
          {
            ConditionKey: 'aws:ResourceTag/environment',
            ConditionValue: 'production',
          },
        ],
        StringLike: [
          {
            ConditionKey: 'aws:ResourceTag/project',
            ConditionValue: 'my-project-*',
          },
        ],
        StringNotEquals: [
          {
            ConditionKey: 'aws:ResourceTag/temporary',
            ConditionValue: 'true',
          },
        ],
        StringNotLike: [
          {
            ConditionKey: 'aws:ResourceTag/name',
            ConditionValue: 'test-*',
          },
        ],
      },
    },
  });
});

test('conditions with multiple stringEquals (AND logic)', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
    ],
    conditions: {
      stringEquals: [
        { key: 'aws-backup', value: '1' },
        { key: 'environment', value: 'production' },
        { key: 'team', value: 'platform' },
      ],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn:aws:ec2:*:*:volume/*',
      ],
      Conditions: {
        StringEquals: [
          {
            ConditionKey: 'aws:ResourceTag/aws-backup',
            ConditionValue: '1',
          },
          {
            ConditionKey: 'aws:ResourceTag/environment',
            ConditionValue: 'production',
          },
          {
            ConditionKey: 'aws:ResourceTag/team',
            ConditionValue: 'platform',
          },
        ],
      },
    },
  });
});

test('conditions are not rendered when empty', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    conditions: {
      stringEquals: [],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn1',
      ],
      Conditions: Match.absent(),
    },
  });
});

test('conditions are not rendered when undefined', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn1',
      ],
      Conditions: Match.absent(),
    },
  });
});

test('existing fromTag behavior unchanged (uses ListOfTags for OR logic)', () => {
  // WHEN - This is a regression test to ensure existing behavior is preserved
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
      BackupResource.fromTag('stage', 'prod'),
      BackupResource.fromTag('environment', 'production'),
    ],
  });

  // THEN - Should use ListOfTags (OR logic), not Conditions (AND logic)
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn:aws:ec2:*:*:volume/*',
      ],
      ListOfTags: [
        {
          ConditionKey: 'stage',
          ConditionType: 'STRINGEQUALS',
          ConditionValue: 'prod',
        },
        {
          ConditionKey: 'environment',
          ConditionType: 'STRINGEQUALS',
          ConditionValue: 'production',
        },
      ],
      // Conditions should NOT be present when using fromTag
      Conditions: Match.absent(),
    },
  });
});

test('conditions can be used together with fromTag (both ListOfTags and Conditions)', () => {
  // WHEN - Using both conditions (AND logic) and fromTag (OR logic)
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
      BackupResource.fromTag('legacy-tag', 'yes'),
    ],
    conditions: {
      stringEquals: [
        { key: 'aws-backup', value: '1' },
      ],
    },
  });

  // THEN - Both ListOfTags and Conditions should be present
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        'arn:aws:ec2:*:*:volume/*',
      ],
      ListOfTags: [
        {
          ConditionKey: 'legacy-tag',
          ConditionType: 'STRINGEQUALS',
          ConditionValue: 'yes',
        },
      ],
      Conditions: {
        StringEquals: [
          {
            ConditionKey: 'aws:ResourceTag/aws-backup',
            ConditionValue: '1',
          },
        ],
      },
    },
  });
});


test('throws error when condition key contains a token', () => {
  // GIVEN - Use Lazy.string to create a token for the key
  const { Lazy } = require('../../core');
  const dynamicKey = Lazy.string({ produce: () => 'dynamic-key' });

  // WHEN/THEN
  expect(() => {
    new BackupSelection(stack, 'Selection', {
      backupPlan: plan,
      resources: [
        BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
      ],
      conditions: {
        stringEquals: [
          { key: dynamicKey, value: 'some-value' },
        ],
      },
    });
  }).toThrow(/Backup selection condition keys must be static strings/);
});

test('allows token values in conditions (only keys must be static)', () => {
  // GIVEN - Use Lazy.string to create a token for the value
  const { Lazy } = require('../../core');
  const dynamicValue = Lazy.string({ produce: () => 'dynamic-value' });

  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
    ],
    conditions: {
      stringEquals: [
        { key: 'static-key', value: dynamicValue },
      ],
    },
  });

  // THEN - Should succeed (values can be tokens, only keys must be static)
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Conditions: {
        StringEquals: [
          {
            ConditionKey: 'aws:ResourceTag/static-key',
            ConditionValue: 'dynamic-value',
          },
        ],
      },
    },
  });
});
