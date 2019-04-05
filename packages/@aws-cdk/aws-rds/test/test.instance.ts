import { countResources, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import rds = require('../lib');

export = {
  'create a DB instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.OracleSE1,
      licenseModel: rds.LicenseModel.BringYourOwnLicense,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Medium),
      multiAz: true,
      storageType: rds.StorageType.IO1,
      masterUsername: 'syscdk',
      vpc,
      databaseName: 'ORCL',
      storageEncrypted: true,
      backupRetentionPeriod: 7,
      monitoringInterval: 60,
      enablePerformanceInsights: true,
      cloudwatchLogsExports: [
        'trace',
        'audit',
        'alert',
        'listener'
      ],
      cloudwatchLogsRetention: logs.RetentionDays.OneMonth,
      autoMinorVersionUpgrade: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      Properties: {
        DBInstanceClass: 'db.t2.medium',
        AllocatedStorage: '100',
        AutoMinorVersionUpgrade: false,
        BackupRetentionPeriod: '7',
        CopyTagsToSnapshot: true,
        DBName: 'ORCL',
        DBSubnetGroupName: {
          Ref: 'InstanceSubnetGroupF2CBA54F'
        },
        DeletionProtection: true,
        EnableCloudwatchLogsExports: [
          'trace',
          'audit',
          'alert',
          'listener'
        ],
        EnablePerformanceInsights: true,
        Engine: 'oracle-se1',
        Iops: 1000,
        LicenseModel: 'bring-your-own-license',
        MasterUsername: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              {
                Ref: 'InstanceSecret478E0A47'
              },
              ':SecretString:username::}}'
            ]
          ]
        },
        MasterUserPassword: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              {
                Ref: 'InstanceSecret478E0A47'
              },
              ':SecretString:password::}}'
            ]
          ]
        },
        MonitoringInterval: 60,
        MonitoringRoleArn: {
          'Fn::GetAtt': [
            'InstanceMonitoringRole3E2B4286',
            'Arn'
          ]
        },
        MultiAZ: true,
        PerformanceInsightsRetentionPeriod: 7,
        StorageEncrypted: true,
        StorageType: 'io1',
        VPCSecurityGroups: [
          {
            'Fn::GetAtt': [
              'InstanceSecurityGroupB4E5FA83',
              'GroupId'
            ]
          }
        ]
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'Subnet group for Instance database',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0'
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A'
        },
        {
          Ref: 'VPCPrivateSubnet3Subnet3EDCD457'
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Security group for Instance database',
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'monitoring.rds.amazonaws.com'
            }
          }
        ],
        Version: '2012-10-17'
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition'
              },
              ':iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'
            ]
          ]
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"syscdk"}'
      }
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::SecretTargetAttachment', {
      SecretId: {
        Ref: 'InstanceSecret478E0A47'
      },
      TargetId: {
        Ref: 'InstanceC1063A87'
      },
      TargetType: 'AWS::RDS::DBInstance'
    }));

    expect(stack).to(countResources('Custom::LogRetention', 4));

    test.done();
  },

  'instance with option and parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    const optionGroup = new rds.OptionGroup(stack, 'OptionGroup', {
      engineName: rds.DatabaseInstanceEngine.OracleSE1,
      majorEngineVersion: '11.2',
      configurations: [
        {
          name: 'XMLDB'
        }
      ]
    });

    const parameterGroup = new rds.ParameterGroup(stack, 'ParameterGroup', {
      family: 'hello',
      description: 'desc',
      parameters: {
        key: 'value'
      }
    });

    // WHEN
    new rds.DatabaseInstance(stack, 'Database', {
      engine: rds.DatabaseInstanceEngine.SqlServerEE,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'syscdk',
      masterUserPassword: 'tooshort',
      vpc,
      optionGroup,
      parameterGroup
    });

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'ParameterGroup5E32DECB'
      },
      OptionGroupName: {
        Ref: 'OptionGroupACA43DC1'
      }
    }));

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const stack2 = new cdk.Stack();

    const instance = new rds.DatabaseInstance(stack1, 'Instance', {
      engine: rds.DatabaseInstanceEngine.Mysql,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'admin',
      vpc: new ec2.VpcNetwork(stack1, 'VPC'),
    });

    // WHEN
    rds.DatabaseInstance.import(stack2, 'Instance', instance.export());

    // THEN: No error

    test.done();
  },

  'create an instance from snapshot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.Postgres,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Large),
      vpc
    });

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DBSnapshotIdentifier: 'my-snapshot'
    }));

    test.done();
  },

  'throws when trying to generate a new password from snapshot without username'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // THEN
    test.throws(() => new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.Mysql,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Large),
      vpc,
      generateMasterUserPassword: true,
    }), /`masterUsername`.*`generateMasterUserPassword`/);

    test.done();
  },

  'create a read replica'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const sourceInstance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.Mysql,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'admin',
      vpc
    });

    // WHEN
    new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
      sourceDatabaseInstance: sourceInstance,
      engine: rds.DatabaseInstanceEngine.Mysql,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Large),
      vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      SourceDBInstanceIdentifier: {
        Ref: 'InstanceC1063A87'
      }
    }));

    test.done();
  },

  'on event'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.Mysql,
      instanceClass: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
      masterUsername: 'admin',
      vpc
    });
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('dummy'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
    });

    // WHEN
    instance.onEvent('InstanceEvent', fn);

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      EventPattern: {
        source: [
          'aws.rds'
        ],
        resources: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition'
                },
                ':rds:',
                {
                  Ref: 'AWS::Region'
                },
                ':',
                {
                  Ref: 'AWS::AccountId'
                },
                ':db:',
                {
                  Ref: 'InstanceC1063A87'
                }
              ]
            ]
          }
        ]
      }
    }));

    test.done();
  }
};
