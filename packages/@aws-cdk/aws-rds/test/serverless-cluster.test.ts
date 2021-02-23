import { expect, haveResource, haveResourceLike, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { AuroraPostgresEngineVersion, ServerlessCluster, DatabaseClusterEngine, ParameterGroup, AuroraCapacityUnit, DatabaseSecret } from '../lib';

nodeunitShim({
  'can create a Serverless Cluster with Aurora Postgres database engine'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-postgresql',
        DBClusterParameterGroupName: 'default.aurora-postgresql10',
        DBSubnetGroupName: {
          Ref: 'ServerlessDatabaseSubnets5643CD76',
        },
        EngineMode: 'serverless',
        MasterUsername: 'admin',
        MasterUserPassword: 'tooshort',
        StorageEncrypted: true,
        VpcSecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'ServerlessDatabaseSecurityGroupB00D8C0F',
              'GroupId',
            ],
          },
        ],
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'can create a Serverless Cluster with Aurora Mysql database engine'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-mysql',
        DBClusterParameterGroupName: 'default.aurora-mysql5.7',
        DBSubnetGroupName: {
          Ref: 'ServerlessDatabaseSubnets5643CD76',
        },
        EngineMode: 'serverless',
        MasterUsername: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              {
                Ref: 'ServerlessDatabaseSecret1C9BF4F1',
              },
              ':SecretString:username::}}',
            ],
          ],
        },
        MasterUserPassword: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              {
                Ref: 'ServerlessDatabaseSecret1C9BF4F1',
              },
              ':SecretString:password::}}',
            ],
          ],
        },
        StorageEncrypted: true,
        VpcSecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'ServerlessDatabaseSecurityGroupB00D8C0F',
              'GroupId',
            ],
          },
        ],
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    }, ResourcePart.CompleteDefinition));
    test.done();
  },

  'can create a Serverless cluster with imported vpc and security group'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
      vpcId: 'VPC12345',
    });
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'SecurityGroupId12345');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc,
      securityGroups: [sg],
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      DBClusterParameterGroupName: 'default.aurora-postgresql10',
      EngineMode: 'serverless',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:username::}}',
          ],
        ],
      },
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:password::}}',
          ],
        ],
      },
      VpcSecurityGroupIds: ['SecurityGroupId12345'],
    }));

    test.done();
  },

  "sets the retention policy of the SubnetGroup to 'Retain' if the Serverless Cluster is created with 'Retain'"(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new ServerlessCluster(stack, 'Cluster', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    expect(stack).to(haveResourceLike('AWS::RDS::DBSubnetGroup', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'creates a secret when master credentials are not specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'myuser',
        excludeCharacters: '"@/\\',
      },
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      MasterUsername: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:username::}}',
          ],
        ],
      },
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:password::}}',
          ],
        ],
      },
    }));

    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"myuser"}',
      },
    }));

    test.done();
  },

  'create an Serverless cluster with custom KMS key for storage'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      storageEncryptionKey: new kms.Key(stack, 'Key'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn',
        ],
      },
    }));

    test.done();
  },

  'create a cluster using a specific version of Postgresql'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_7,
      }),
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      EngineMode: 'serverless',
      EngineVersion: '10.7',
    }));

    test.done();
  },

  'cluster exposes different read and write endpoints'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
      },
      vpc,
    });

    // THEN
    test.notDeepEqual(
      stack.resolve(cluster.clusterEndpoint),
      stack.resolve(cluster.clusterReadEndpoint),
    );

    test.done();
  },

  'imported cluster with imported security group honors allowAllOutbound'(test: Test) {
    // GIVEN
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      })],
    });

    // WHEN
    cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    }));

    test.done();
  },

  'can import a serverless cluster with minimal attributes'(test: Test) {
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    test.equals(cluster.clusterIdentifier, 'identifier');

    test.done();
  },

  'minimal imported cluster throws on accessing attributes for missing parameters'(test: Test) {
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    test.throws(() => cluster.clusterEndpoint, /Cannot access `clusterEndpoint` of an imported cluster/);
    test.throws(() => cluster.clusterReadEndpoint, /Cannot access `clusterReadEndpoint` of an imported cluster/);

    test.done();
  },

  'imported cluster can access properties if attributes are provided'(test: Test) {
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      })],
    });

    test.equals(cluster.clusterEndpoint.socketAddress, 'addr:3306');
    test.equals(cluster.clusterReadEndpoint.socketAddress, 'reader-address:3306');

    test.done();
  },

  'throws when trying to add rotation to a serverless cluster without secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.plainText('tooshort'),
      },
      vpc,
    });

    // THEN
    test.throws(() => cluster.addRotationSingleUser(), /without secret/);

    test.done();
  },

  'throws when trying to add single user rotation multiple times'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: { username: 'admin' },
      vpc,
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    test.throws(() => cluster.addRotationSingleUser(), /A single user rotation was already added to this cluster/);

    test.done();
  },

  'can set deletion protection'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      deletionProtection: true,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::RDS::DBCluster', {
      DeletionProtection: true,
    }));

    test.done();
  },

  'can set backup retention'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      backupRetention: cdk.Duration.days(2),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::RDS::DBCluster', {
      BackupRetentionPeriod: 2,
    }));

    test.done();
  },

  'does not throw (but adds a node error) if a (dummy) VPC does not have sufficient subnets'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      vpcSubnets: {
        subnetName: 'DefinitelyDoesNotExist',
      },
    });

    // THEN
    const art = SynthUtils.synthesize(stack);
    const meta = art.findMetadataByType('aws:cdk:error');
    test.equal(meta[0].data, 'Cluster requires at least 2 subnets, got 0');

    test.done();
  },

  'can set scaling configuration'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      scaling: {
        minCapacity: AuroraCapacityUnit.ACU_1,
        maxCapacity: AuroraCapacityUnit.ACU_128,
        autoPause: cdk.Duration.minutes(10),
      },
    });

    //THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: true,
        MaxCapacity: 128,
        MinCapacity: 1,
        SecondsUntilAutoPause: 600,
      },
    }));

    test.done();
  },

  'can enable Data API'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      enableDataApi: true,
    });

    //THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    }));

    test.done();
  },

  'default scaling options'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      scaling: {},
    });

    //THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: true,
      },
    }));

    test.done();
  },

  'auto pause is disabled if a time of zero is specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      scaling: {
        autoPause: cdk.Duration.seconds(0),
      },
    });

    //THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: false,
      },
    }));

    test.done();
  },

  'throws when invalid auto pause time is specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    test.throws(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          autoPause: cdk.Duration.seconds(30),
        },
      }), /auto pause time must be between 5 minutes and 1 day./);

    test.throws(() =>
      new ServerlessCluster(stack, 'Another Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          autoPause: cdk.Duration.days(2),
        },
      }), /auto pause time must be between 5 minutes and 1 day./);

    test.done();
  },

  'throws when invalid backup retention period is specified'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    test.throws(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        backupRetention: cdk.Duration.days(0),
      }), /backup retention period must be between 1 and 35 days. received: 0/);

    test.throws(() =>
      new ServerlessCluster(stack, 'Another Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        backupRetention: cdk.Duration.days(36),
      }), /backup retention period must be between 1 and 35 days. received: 36/);

    test.done();
  },

  'throws error when min capacity is greater than max capacity'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    test.throws(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          minCapacity: AuroraCapacityUnit.ACU_2,
          maxCapacity: AuroraCapacityUnit.ACU_1,
        },
      }), /maximum capacity must be greater than or equal to minimum capacity./);

    test.done();
  },

  'check that clusterArn property works'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
    });
    const exportName = 'DbCluterArn';

    // WHEN
    new cdk.CfnOutput(stack, exportName, {
      exportName,
      value: cluster.clusterArn,
    });

    // THEN
    test.deepEqual(stack.resolve(cluster.clusterArn), {
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':rds:us-test-1:12345:cluster:',
          { Ref: 'DatabaseB269D8BB' },
        ],
      ],
    });
    test.done();
  },

  'can grant Data API access'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      enableDataApi: true,
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    cluster.grantDataApiAccess(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'rds-data:BatchExecuteStatement',
              'rds-data:BeginTransaction',
              'rds-data:CommitTransaction',
              'rds-data:ExecuteStatement',
              'rds-data:RollbackTransaction',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'DatabaseSecretAttachmentE5D1B020',
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
    }));

    test.done();
  },

  'can grant Data API access on imported cluster with given secret'(test: Test) {
    // GIVEN
    const stack = testStack();
    const secret = new DatabaseSecret(stack, 'Secret', {
      username: 'admin',
    });
    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Cluster', {
      clusterIdentifier: 'ImportedDatabase',
      secret,
    });
    const user = new iam.User(stack, 'User');


    // WHEN
    cluster.grantDataApiAccess(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'rds-data:BatchExecuteStatement',
              'rds-data:BeginTransaction',
              'rds-data:CommitTransaction',
              'rds-data:ExecuteStatement',
              'rds-data:RollbackTransaction',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05',
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
    }));

    test.done();
  },

  'grant Data API access enables the Data API'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    cluster.grantDataApiAccess(user);

    //THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    }));

    test.done();
  },

  'grant Data API access throws if the Data API is disabled'(test: Test) {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      enableDataApi: false,
    });
    const user = new iam.User(stack, 'User');

    // WHEN
    test.throws(() => cluster.grantDataApiAccess(user), /Cannot grant Data API access when the Data API is disabled/);

    test.done();
  },
});


function testStack() {
  const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
