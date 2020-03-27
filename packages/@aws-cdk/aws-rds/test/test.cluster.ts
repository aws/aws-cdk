import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ClusterParameterGroup, DatabaseCluster, DatabaseClusterEngine, ParameterGroup } from '../lib';

export = {
  'check that instantiation works'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: "aurora",
        DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
        MasterUsername: "admin",
        MasterUserPassword: "tooshort",
        VpcSecurityGroupIds: [ {"Fn::GetAtt": ["DatabaseSecurityGroup5C91FDCB", "GroupId"]}]
      },
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain'
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
  'can create a cluster with a single instance'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora",
      DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
      MasterUsername: "admin",
      MasterUserPassword: "tooshort",
      VpcSecurityGroupIds: [ {"Fn::GetAtt": ["DatabaseSecurityGroup5C91FDCB", "GroupId"]}]
    }));

    test.done();
  },

  'can create a cluster with imported vpc and security group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
      vpcId: "VPC12345"
    });
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', "SecurityGroupId12345");

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
        securityGroup: sg
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora",
      DBSubnetGroupName: { Ref: "DatabaseSubnets56F17B9A" },
      MasterUsername: "admin",
      MasterUserPassword: "tooshort",
      VpcSecurityGroupIds: [ "SecurityGroupId12345" ]
    }));

    test.done();
  },

  'cluster with parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const group = new ClusterParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'bye',
      parameters: {
        param: 'value'
      }
    });
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      parameterGroup: group
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: { Ref: 'ParamsA8366201' },
    }));

    test.done();
  },

  'creates a secret when master credentials are not specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      MasterUsername: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195'
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
              Ref: 'DatabaseSecret3B817195'
            },
            ':SecretString:password::}}'
          ]
        ]
      },
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}'
      }
    }));

    test.done();
  },

  'create an encrypted cluster with custom KMS key'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      kmsKey: new kms.Key(stack, 'Key')
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn'
        ]
      }
    }));

    test.done();
  },

  'cluster with instance parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      family: 'hello',
      parameters: {
        key: 'value'
      }
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      masterUser: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        parameterGroup,
        vpc
      }
    });

    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'ParameterGroup5E32DECB'
      }
    }));

    test.done();

  },

  'create a cluster using a specific version of MySQL'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      engineVersion: "5.7.mysql_aurora.2.04.4",
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora-mysql",
      EngineVersion: "5.7.mysql_aurora.2.04.4",
    }));

    test.done();
  },

  'create a cluster using a specific version of Postgresql'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      engineVersion: "10.7",
      masterUser: {
        username: 'admin'
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: "aurora-postgresql",
      EngineVersion: "10.7",
    }));

    test.done();
  },

  'cluster exposes different read and write endpoints'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      masterUser: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    test.notDeepEqual(
      stack.resolve(cluster.clusterEndpoint),
      stack.resolve(cluster.clusterReadEndpoint)
    );

    test.done();
  },

  'imported cluster with imported security group honors allowAllOutbound'(test: Test) {
    // GIVEN
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      instanceEndpointAddresses: ['addr'],
      instanceIdentifiers: ['identifier'],
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false
      }),
    });

    // WHEN
    cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    }));

    test.done();
  },

  "cluster with enabled monitoring"(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      monitoringInterval: cdk.Duration.minutes(1),
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBInstance", {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        "Fn::GetAtt": ["DatabaseMonitoringRole576991DA", "Arn"]
      }
    }, ResourcePart.Properties));

    expect(stack).to(haveResource("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "monitoring.rds.amazonaws.com"
            }
          }
        ],
        Version: "2012-10-17"
      },
      ManagedPolicyArns: [
        {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                Ref: "AWS::Partition"
              },
              ":iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
            ]
          ]
        }
      ]
    }));

    test.done();
  },

  'create a cluster with imported monitoring role'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const monitoringRole = new Role(stack, "MonitoringRole", {
      assumedBy: new ServicePrincipal("monitoring.rds.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole')
      ]
    });

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
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

  'throws when trying to add rotation to a cluster without secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort')
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // THEN
    test.throws(() => cluster.addRotationSingleUser(), /without secret/);

    test.done();
  },

  'throws when trying to add single user rotation multiple times'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      masterUser: { username: 'admin' },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      }
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    test.throws(() => cluster.addRotationSingleUser(), /A single user rotation was already added to this cluster/);

    test.done();
  },

  'create a cluster with s3 import role'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ImportRole: associatedRole
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "AssociatedRole824CFCD3",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          "Fn::GetAtt": [
            "AssociatedRole824CFCD3",
            "Arn"
          ]
        }
      }
    }));

    test.done();
  },

  'create a cluster with s3 import buckets'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ImportBuckets: [bucket]
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        }
      }
    }));

    expect(stack).to(haveResource("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*"
            ],
            Effect: "Allow",
            Resource: [
              {
                "Fn::GetAtt": [
                  "Bucket83908E77",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "Bucket83908E77",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          }
        ],
        Version: "2012-10-17"
      }
    }));

    test.done();
  },

  'create a cluster with s3 export role'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ExportRole: associatedRole
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "AssociatedRole824CFCD3",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          "Fn::GetAtt": [
            "AssociatedRole824CFCD3",
            "Arn"
          ]
        }
      }
    }));

    test.done();
  },

  'create a cluster with s3 export buckets'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ExportBuckets: [bucket]
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }
    }));

    expect(stack).to(haveResource("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*",
              "s3:DeleteObject*",
              "s3:PutObject*",
              "s3:Abort*"
            ],
            Effect: "Allow",
            Resource: [
              {
                "Fn::GetAtt": [
                  "Bucket83908E77",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "Bucket83908E77",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          }
        ],
        Version: "2012-10-17"
      }
    }));

    test.done();
  },

  'create a cluster with s3 import and export buckets'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket]
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        }
      },
      {
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        },
        aurora_select_into_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }
    }));

    test.done();
  },

  'create a cluster with s3 import and export buckets and custom parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const parameterGroup = new ClusterParameterGroup(stack, 'ParameterGroup', {
      family: 'family',
      parameters: {
        key: 'value'
      }
    });

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      parameterGroup,
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket]
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        }
      },
      {
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).to(haveResource("AWS::RDS::DBClusterParameterGroup", {
      Family: 'family',
      Parameters: {
        key: 'value',
        aurora_load_from_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ImportRole377BC9C0",
            "Arn"
          ]
        },
        aurora_select_into_s3_role: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }
    }));

    test.done();
  },

  'PostgreSQL cluster with s3 export buckets does not generate custom parameter group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ExportBuckets: [bucket]
    });

    // THEN
    expect(stack).to(haveResource("AWS::RDS::DBCluster", {
      AssociatedRoles: [{
        RoleArn: {
          "Fn::GetAtt": [
            "DatabaseS3ExportRole9E328562",
            "Arn"
          ]
        }
      }]
    }));

    expect(stack).notTo(haveResource("AWS::RDS::DBClusterParameterGroup"));

    test.done();
  },

  'throws when s3ExportRole and s3ExportBuckets properties are both specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const exportRole = new Role(stack, 'ExportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // THEN
    test.throws(() => new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ExportRole: exportRole,
      s3ExportBuckets: [exportBucket],
    }));

    test.done();
  },

  'throws when s3ImportRole and s3ImportBuckets properties are both specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, "VPC");

    const importRole = new Role(stack, 'ImportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const importBucket = new s3.Bucket(stack, 'ImportBucket');

    // THEN
    test.throws(() => new DatabaseCluster(stack, "Database", {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      masterUser: {
        username: "admin"
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc
      },
      s3ImportRole: importRole,
      s3ImportBuckets: [importBucket],
    }));

    test.done();
  },
};

function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' }});
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
