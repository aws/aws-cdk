import { Template } from '@aws-cdk/assertions';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as iam from '@aws-cdk/aws-iam';
import * as rds from '@aws-cdk/aws-rds';
import * as s3 from '@aws-cdk/aws-s3';
import { RemovalPolicy, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
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

test('generated IAM role with customRole flag', () => {
  // WHEN

  // Create a backup selection
  const selection = new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    customRole: true,
  });

  // use the exposed role property to add additional policies
  const iamRole = selection.role;
  const fakePolicyName = 'FakePolicyName';
  // add example fake managed policy
  iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(fakePolicyName));

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
            ':iam::aws:policy/' + fakePolicyName,
          ],
        ],
      },
    ],
  });
});

test('provided IAM role with customRole flag', () => {
  // WHEN

  // User provided role
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
  });

  // Add a policy to the provided role
  const fakePolicyName = 'FakePolicyName';

  // add example fake managed policy
  role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(fakePolicyName));

  // Create a backup selection
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    role: role,
    customRole: true,
  });

  // Get the template
  const template = Template.fromStack(stack);

  // Discover the added bucket
  const roles = template.findResources(
    'AWS::IAM::Role', {},
  );

  // Get bucket ID
  expect(Object.keys(roles)).toHaveLength(1);
  const roleName = Object.keys(roles)[0];

  // THEN

  // Has a role with only the users custom policy
  template.hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/' + fakePolicyName,
          ],
        ],
      },
    ],
  });

  // Has a Backup selection which uses the custom role
  template.hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      IamRoleArn: {
        'Fn::GetAtt': [
          roleName,
          'Arn',
        ],
      },
    },
  });

});


test('customised IAM role with default policies', () => {
  // WHEN

  // Create a backup selection
  const selection = new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    allowRestores: true,
    allowS3Backup: true,
    allowS3Restores: true,
  });

  // use the exposed role property to add additional policies
  const iamRole = selection.role;
  const fakePolicyName = 'FakePolicyName';
  // add example fake managed policy
  iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(fakePolicyName));

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
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/AWSBackupServiceRolePolicyForS3Backup',
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
            ':iam::aws:policy/AWSBackupServiceRolePolicyForS3Restore',
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
            ':iam::aws:policy/' + fakePolicyName,
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

test('allow S3 backup', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    allowRestores: true,
    allowS3Backup: true,
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
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/AWSBackupServiceRolePolicyForS3Backup',
          ],
        ],
      },
    ],
  });
});

test('allow S3 backup and restore', () => {
  // WHEN
  new BackupSelection(stack, 'Selection', {
    backupPlan: plan,
    resources: [
      BackupResource.fromArn('arn1'),
    ],
    allowRestores: true,
    allowS3Backup: true,
    allowS3Restores: true,
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
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/AWSBackupServiceRolePolicyForS3Backup',
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
            ':iam::aws:policy/AWSBackupServiceRolePolicyForS3Restore',
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

      new s3.Bucket(this, 'Bucket', {});

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
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
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

  // Get the template
  const template = Template.fromStack(stack);

  // Discover the added bucket
  const buckets = template.findResources(
    'AWS::S3::Bucket', {},
  );

  // Get bucket ID
  expect(Object.keys(buckets)).toHaveLength(1);
  const newBucketName = Object.keys(buckets)[0];

  // THEN
  template.hasResourceProperties('AWS::Backup::BackupSelection', {
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
        // New bucket ARN
        {
          'Fn::GetAtt': [
            newBucketName,
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

test('fromS3Bucket', () => {
  // GIVEN
  const newBucket = new s3.Bucket(stack, 'New', {
  });
  const existingBucketARN = 'arn:aws:s3:::existing-bucket';
  const existingBucket = s3.Bucket.fromBucketArn(stack, 'Existing', existingBucketARN);

  // WHEN
  // Select both a new and existing bucket
  plan.addSelection('Selection', {
    resources: [
      BackupResource.fromS3Bucket(newBucket),
      BackupResource.fromS3Bucket(existingBucket),
    ],
    allowS3Backup: true,
    allowS3Restores: true,
  });

  // THEN

  // Get the template
  const template = Template.fromStack(stack);

  // Discover the added bucket
  const buckets = template.findResources(
    'AWS::S3::Bucket', {},
  );

  // Get bucket ID
  expect(Object.keys(buckets)).toHaveLength(1);
  const newBucketName = Object.keys(buckets)[0];

  // Check that the new and existing bucket resource was added properly
  template.hasResourceProperties('AWS::Backup::BackupSelection', {
    BackupSelection: {
      Resources: [
        // New Bucket ARN reference
        {
          'Fn::GetAtt': [
            newBucketName,
            'Arn',
          ],
        },
        // Existing bucket ARN directly
        existingBucketARN,
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
    parameterGroup: rds.ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
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
