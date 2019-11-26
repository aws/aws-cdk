import { countResources, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import targets = require('@aws-cdk/aws-events-targets');
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import rds = require('../lib');

export = {
  'create a DB instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
      licenseModel: rds.LicenseModel.BRING_YOUR_OWN_LICENSE,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MEDIUM),
      multiAz: true,
      storageType: rds.StorageType.IO1,
      masterUsername: 'syscdk',
      vpc,
      databaseName: 'ORCL',
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(7),
      monitoringInterval: cdk.Duration.minutes(1),
      enablePerformanceInsights: true,
      cloudwatchLogsExports: [
        'trace',
        'audit',
        'alert',
        'listener'
      ],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      autoMinorVersionUpgrade: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      Properties: {
        DBInstanceClass: 'db.t2.medium',
        AllocatedStorage: '100',
        AutoMinorVersionUpgrade: false,
        BackupRetentionPeriod: 7,
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
    const vpc = new ec2.Vpc(stack, 'VPC');

    const optionGroup = new rds.OptionGroup(stack, 'OptionGroup', {
      engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
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
      engine: rds.DatabaseInstanceEngine.SQL_SERVER_EE,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'syscdk',
      masterUserPassword: cdk.SecretValue.plainText('tooshort'),
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

  'create an instance from snapshot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
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
    const vpc = new ec2.Vpc(stack, 'VPC');

    // THEN
    test.throws(() => new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
      vpc,
      generateMasterUserPassword: true,
    }), '`masterUsername` must be specified when `generateMasterUserPassword` is set to true.');

    test.done();
  },

  'throws when specifying user name without asking to generate a new password'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // THEN
    test.throws(() => new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
      vpc,
      masterUsername: 'superadmin'
    }), 'Cannot specify `masterUsername` when `generateMasterUserPassword` is set to false.');

    test.done();
  },

  'throws when password and generate password ar both specified'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // THEN
    test.throws(() => new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
      snapshotIdentifier: 'my-snapshot',
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
      vpc,
      masterUserPassword: cdk.SecretValue.plainText('supersecret'),
      generateMasterUserPassword: true,
    }), 'Cannot specify `masterUserPassword` when `generateMasterUserPassword` is set to true.');

    test.done();
  },

  'create a read replica'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const sourceInstance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc
    });

    // WHEN
    new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
      sourceDatabaseInstance: sourceInstance,
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
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
    const vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc
    });
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('dummy'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X
    });

    // WHEN
    instance.onEvent('InstanceEvent', { target: new targets.LambdaFunction(fn) });

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
      },
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'Function76856677',
              'Arn'
            ],
          },
          Id: 'Target0'
        }
      ]
    }));

    test.done();
  },

  'on event without target'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc
    });

    // WHEN
    instance.onEvent('InstanceEvent');

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
  },

  'can use metricCPUUtilization'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc
    });

    // THEN
    test.deepEqual(stack.resolve(instance.metricCPUUtilization()), {
      dimensions: { DBInstanceIdentifier: { Ref: 'InstanceC1063A87' } },
      namespace: 'AWS/RDS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average'
    });

    test.done();
  },

  'can resolve endpoint port and socket address'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc
    });

    test.deepEqual(stack.resolve(instance.instanceEndpoint.port), {
      'Fn::GetAtt': ['InstanceC1063A87', 'Endpoint.Port']
    });

    test.deepEqual(stack.resolve(instance.instanceEndpoint.socketAddress), {
      'Fn::Join': [
        '',
        [
          { 'Fn::GetAtt': ['InstanceC1063A87', 'Endpoint.Address'] },
          ':',
          { 'Fn::GetAtt': ['InstanceC1063A87', 'Endpoint.Port'] },
        ]
      ]
    });

    test.done();
  },

  'can deactivate backup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc,
      backupRetention: cdk.Duration.seconds(0),
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      BackupRetentionPeriod: 0
    }));

    test.done();
  },

  'imported instance with imported security group with allowAllOutbound set to false'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const instance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Database', {
      instanceEndpointAddress: 'address',
      instanceIdentifier: 'identifier',
      port: 3306,
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false
      })],
    });

    // WHEN
    instance.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    }));

    test.done();
  },

  'create an instance with imported monitoring role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const monitoringRole = new Role(stack, "MonitoringRole", {
      assumedBy: new ServicePrincipal("monitoring.rds.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole')
      ]
    });

    // WHEN
    new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc,
      monitoringInterval: cdk.Duration.minutes(1),
      monitoringRole
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBInstance", {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        "Fn::GetAtt": ["MonitoringRole90457BF9", "Arn"]
      }
    }, ResourcePart.Properties));

    test.done();
  },

  'create an instance with an existing security group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
      allowAllOutbound: false
    });

    // WHEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc,
      securityGroups: [securityGroup],
    });
    instance.connections.allowDefaultPortFromAnyIpv4();

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      VPCSecurityGroups: ['sg-123456789']
    }));

    expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
      FromPort: {
        'Fn::GetAtt': [
          'InstanceC1063A87',
          'Endpoint.Port'
        ]
      },
      GroupId: 'sg-123456789',
      ToPort: {
        'Fn::GetAtt': [
          'InstanceC1063A87',
          'Endpoint.Port'
        ]
      }
    }));

    test.done();
  }
};
