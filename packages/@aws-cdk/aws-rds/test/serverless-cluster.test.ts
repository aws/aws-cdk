import { Template, Match } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { AuroraPostgresEngineVersion, ServerlessCluster, DatabaseClusterEngine, ParameterGroup, AuroraCapacityUnit, DatabaseSecret, SubnetGroup } from '../lib';

describe('serverless cluster', () => {
  test('can create a Serverless Cluster with Aurora Postgres database engine', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-postgresql',
        CopyTagsToSnapshot: true,
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
    });
  });

  test('can create a Serverless Cluster with Aurora Mysql database engine', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ServerlessCluster(stack, 'ServerlessDatabase', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora-mysql',
        CopyTagsToSnapshot: true,
        DBClusterParameterGroupName: 'default.aurora-mysql5.7',
        DBSubnetGroupName: {
          Ref: 'ServerlessDatabaseSubnets5643CD76',
        },
        EngineMode: 'serverless',
        MasterUsername: {
          'Fn::Join': ['', [
            '{{resolve:secretsmanager:',
            { Ref: 'ServerlessDatabaseSecret1C9BF4F1' },
            ':SecretString:username::}}',
          ]],
        },
        MasterUserPassword: {
          'Fn::Join': ['', [
            '{{resolve:secretsmanager:',
            { Ref: 'ServerlessDatabaseSecret1C9BF4F1' },
            ':SecretString:password::}}',
          ]],
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
    });
  });

  test('can create a Serverless cluster with imported vpc and security group', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      DBClusterParameterGroupName: 'default.aurora-postgresql10',
      EngineMode: 'serverless',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSecret3B817195' },
          ':SecretString:username::}}',
        ]],
      },
      MasterUserPassword: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSecret3B817195' },
          ':SecretString:password::}}',
        ]],
      },
      VpcSecurityGroupIds: ['SecurityGroupId12345'],
    });
  });

  test("sets the retention policy of the SubnetGroup to 'Retain' if the Serverless Cluster is created with 'Retain'", () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new ServerlessCluster(stack, 'Cluster', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('creates a secret when master credentials are not specified', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSecret3B817195' },
          ':SecretString:username::}}',
        ]],
      },
      MasterUserPassword: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSecret3B817195' },
          ':SecretString:password::}}',
        ]],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"myuser"}',
      },
    });
  });

  test('create an Serverless cluster with custom KMS key for storage', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn',
        ],
      },
    });
  });

  test('create a cluster using a specific version of Postgresql', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      EngineMode: 'serverless',
      EngineVersion: '10.7',
    });
  });

  test('cluster exposes different read and write endpoints', () => {
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
    expect(stack.resolve(cluster.clusterEndpoint)).not
      .toEqual(stack.resolve(cluster.clusterReadEndpoint));
  });

  test('imported cluster with imported security group honors allowAllOutbound', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    });
  });

  test('can import a serverless cluster with minimal attributes', () => {
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(cluster.clusterIdentifier).toEqual('identifier');
  });

  test('minimal imported cluster throws on accessing attributes for missing parameters', () => {
    const stack = testStack();

    const cluster = ServerlessCluster.fromServerlessClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(() => cluster.clusterEndpoint).toThrow(/Cannot access `clusterEndpoint` of an imported cluster/);
    expect(() => cluster.clusterReadEndpoint).toThrow(/Cannot access `clusterReadEndpoint` of an imported cluster/);
  });

  test('imported cluster can access properties if attributes are provided', () => {
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

    expect(cluster.clusterEndpoint.socketAddress).toEqual('addr:3306');
    expect(cluster.clusterReadEndpoint.socketAddress).toEqual('reader-address:3306');
  });

  test('throws when trying to add single-user rotation to a serverless cluster without secret', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      vpc,
    });

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/without secret/);
  });

  test('throws when trying to add single user rotation multiple times', () => {
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
    expect(() => cluster.addRotationSingleUser()).toThrow(/A single user rotation was already added to this cluster/);
  });

  test('throws when trying to add single-user rotation to a serverless cluster without VPC', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
    });

    // THEN
    expect(() => {
      cluster.addRotationSingleUser();
    }).toThrow(/Cannot add single user rotation for a cluster without VPC/);
  });

  test('throws when trying to add multi-user rotation to a serverless cluster without VPC', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new DatabaseSecret(stack, 'Secret', {
      username: 'admin',
    });

    // WHEN
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
    });

    // THEN
    expect(() => {
      cluster.addRotationMultiUser('someId', { secret });
    }).toThrow(/Cannot add multi user rotation for a cluster without VPC/);
  });

  test('can set deletion protection', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DeletionProtection: true,
    });
  });

  test('can set backup retention', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      BackupRetentionPeriod: 2,
    });
  });

  test('does not throw (but adds a node error) if a (dummy) VPC does not have sufficient subnets', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = testStack(app, 'TestStack');
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
    const art = app.synth().getStackArtifact('TestStack');
    const meta = art.findMetadataByType('aws:cdk:error');
    expect(meta[0].data).toEqual('Cluster requires at least 2 subnets, got 0');
  });

  test('can set scaling configuration', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: true,
        MaxCapacity: 128,
        MinCapacity: 1,
        SecondsUntilAutoPause: 600,
      },
    });
  });

  test('can enable Data API', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    });
  });

  test('default scaling options', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: true,
      },
    });
  });

  test('auto pause is disabled if a time of zero is specified', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      ScalingConfiguration: {
        AutoPause: false,
      },
    });
  });

  test('throws when invalid auto pause time is specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    expect(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          autoPause: cdk.Duration.seconds(30),
        },
      })).toThrow(/auto pause time must be between 5 minutes and 1 day./);

    expect(() =>
      new ServerlessCluster(stack, 'Another Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          autoPause: cdk.Duration.days(2),
        },
      })).toThrow(/auto pause time must be between 5 minutes and 1 day./);
  });

  test('throws when invalid backup retention period is specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    expect(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        backupRetention: cdk.Duration.days(0),
      })).toThrow(/backup retention period must be between 1 and 35 days. received: 0/);

    expect(() =>
      new ServerlessCluster(stack, 'Another Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        backupRetention: cdk.Duration.days(36),
      })).toThrow(/backup retention period must be between 1 and 35 days. received: 36/);
  });

  test('throws error when min capacity is greater than max capacity', () => {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    expect(() =>
      new ServerlessCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        scaling: {
          minCapacity: AuroraCapacityUnit.ACU_2,
          maxCapacity: AuroraCapacityUnit.ACU_1,
        },
      })).toThrow(/maximum capacity must be greater than or equal to minimum capacity./);
  });

  test('check that clusterArn property works', () => {
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
    expect(stack.resolve(cluster.clusterArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':rds:us-test-1:12345:cluster:',
        { Ref: 'DatabaseB269D8BB' },
      ]],
    });
  });

  test('can grant Data API access', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    });
  });

  test('can grant Data API access on imported cluster with given secret', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    });
  });

  test('grant Data API access enables the Data API', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableHttpEndpoint: true,
    });
  });

  test('grant Data API access throws if the Data API is disabled', () => {
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
    expect(() => cluster.grantDataApiAccess(user)).toThrow(/Cannot grant Data API access when the Data API is disabled/);
  });

  test('changes the case of the cluster identifier if the lowercaseDbIdentifier feature flag is enabled', () => {
    // GIVEN
    const app = new cdk.App({
      context: { [cxapi.RDS_LOWERCASE_DB_IDENTIFIER]: true },
    });
    const stack = testStack(app);
    const clusterIdentifier = 'TestClusterIdentifier';
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier.toLowerCase(),
    });
  });

  test('does not change the case of the cluster identifier if the lowercaseDbIdentifier feature flag is disabled', () => {
    // GIVEN
    const app = new cdk.App({ context: { '@aws-cdk/aws-rds:lowercaseDbIdentifier': false } });
    const stack = testStack(app);
    const clusterIdentifier = 'TestClusterIdentifier';
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier,
    });
  });

  test('can create a Serverless cluster without VPC', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-mysql',
      EngineMode: 'serverless',
      DbSubnetGroupName: Match.absent(),
      VpcSecurityGroupIds: [],
    });
  });

  test('cannot create a Serverless cluster without VPC but specifying a security group', () => {
    // GIVEN
    const stack = testStack();
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'SecurityGroupId12345');

    // THEN
    expect(() => new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      securityGroups: [sg],
    })).toThrow(/A VPC is required to use securityGroups in ServerlessCluster. Please add a VPC or remove securityGroups/);
  });

  test('cannot create a Serverless cluster without VPC but specifying a subnet group', () => {
    // GIVEN
    const stack = testStack();
    const SubnetGroupName = 'SubnetGroupId12345';
    const subnetGroup = SubnetGroup.fromSubnetGroupName(stack, 'SubnetGroup12345', SubnetGroupName);

    // THEN
    expect(() => new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      subnetGroup,
    })).toThrow(/A VPC is required to use subnetGroup in ServerlessCluster. Please add a VPC or remove subnetGroup/);
  });

  test('cannot create a Serverless cluster without VPC but specifying VPC subnets', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    const vpcSubnets = {
      subnetName: 'AVpcSubnet',
    };

    // THEN
    expect(() => new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      vpcSubnets,
    })).toThrow(/A VPC is required to use vpcSubnets in ServerlessCluster. Please add a VPC or remove vpcSubnets/);
  });

  test('can call exportValue on endpoint.port', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: { username: 'admin' },
      vpc,
    });

    // WHEN
    stack.exportValue(cluster.clusterEndpoint.port);

    // THEN
    const template = Template.fromStack(stack);
    template.hasOutput('ExportsOutputFnGetAttDatabaseB269D8BBEndpointPort3ACB3F51', {
      Value: { 'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'] },
      Export: { Name: 'Default:ExportsOutputFnGetAttDatabaseB269D8BBEndpointPort3ACB3F51' },
    });
  });

  test('cluster with copyTagsToSnapshot default', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

  test('cluster with copyTagsToSnapshot disabled', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      copyTagsToSnapshot: false,
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: false,
    });
  });

  test('cluster with copyTagsToSnapshot enabled', () => {
    // GIVEN
    const stack = testStack();

    // WHEN
    new ServerlessCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      copyTagsToSnapshot: true,
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql10'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

});

function testStack(app?: cdk.App, id?: string): cdk.Stack {
  const stack = new cdk.Stack(app, id, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
