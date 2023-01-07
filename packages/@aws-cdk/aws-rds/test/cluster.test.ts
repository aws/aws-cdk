import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import {
  AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion, CfnDBCluster, Credentials, DatabaseCluster,
  DatabaseClusterEngine, DatabaseClusterFromSnapshot, ParameterGroup, PerformanceInsightRetention, SubnetGroup, DatabaseSecret,
  DatabaseInstanceEngine, SqlServerEngineVersion, SnapshotCredentials, InstanceUpdateBehaviour, NetworkType,
} from '../lib';

describe('cluster', () => {
  test('creating a Cluster also creates 2 DB Instances', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      iamAuthentication: true,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora',
        DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
        MasterUsername: 'admin',
        MasterUserPassword: 'tooshort',
        VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
        EnableIAMDatabaseAuthentication: true,
        CopyTagsToSnapshot: true,
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBInstance', 2);
    Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('validates that the number of instances is not a deploy-time value', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameter = new cdk.CfnParameter(stack, 'Param', { type: 'Number' });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        instances: parameter.valueAsNumber,
        engine: DatabaseClusterEngine.AURORA,
        instanceProps: {
          vpc,
        },
      });
    }).toThrow('The number of instances an RDS Cluster consists of cannot be provided as a deploy-time only value!');
  });

  test('can create a cluster with a single instance', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
    });

    expect(stack.resolve(cluster.clusterResourceIdentifier)).toEqual({ 'Fn::GetAtt': ['DatabaseB269D8BB', 'DBClusterResourceId'] });
    expect(cluster.instanceIdentifiers).toHaveLength(1);
    expect(stack.resolve(cluster.instanceIdentifiers[0])).toEqual({
      Ref: 'DatabaseInstance1844F58FD',
    });

    expect(cluster.instanceEndpoints).toHaveLength(1);
    expect(stack.resolve(cluster.instanceEndpoints[0])).toEqual({
      hostname: {
        'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'],
      },
      port: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
      socketAddress: {
        'Fn::Join': ['', [
          { 'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'] },
          ':',
          { 'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'] },
        ]],
      },
    });
  });

  test('can create a cluster with ROLLING instance update behaviour', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 5,
      instanceProps: {
        vpc,
      },
      instanceUpdateBehaviour: InstanceUpdateBehaviour.ROLLING,
    });

    // THEN
    const instanceResources = Template.fromStack(stack).findResources('AWS::RDS::DBInstance');
    const instances = Object.keys(instanceResources);
    const instanceDependencies = Object.values(instanceResources)
      .map(properties => (properties.DependsOn as string[]).filter(dependency => instances.includes(dependency)));
    // check that there are only required dependencies to form a chain of dependant instances
    for (const dependencies of instanceDependencies) {
      expect(dependencies.length).toBeLessThanOrEqual(1);
    }
    // check that all but one instance are a dependency of another instance
    const dependantInstances = instanceDependencies.flat();
    expect(dependantInstances).toHaveLength(instances.length - 1);
    expect(instances.filter(it => !dependantInstances.includes(it))).toHaveLength(1);
  });

  test('can create a cluster with imported vpc and security group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
      vpcId: 'VPC12345',
    });
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'SecurityGroupId12345');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
        securityGroups: [sg],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      VpcSecurityGroupIds: ['SecurityGroupId12345'],
    });
  });

  test('cluster with parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const group = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'bye',
      parameters: {
        param: 'value',
      },
    });
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup: group,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: { Ref: 'ParamsA8366201' },
    });
  });

  test("sets the retention policy of the SubnetGroup to 'Retain' if the Cluster is created with 'Retain'", () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new DatabaseCluster(stack, 'Cluster', {
      credentials: { username: 'admin' },
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
        vpc,
      },
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
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        excludeCharacters: '"@/\\',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
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
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}',
      },
    });
  });

  test('create an encrypted cluster with custom KMS key', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
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

  test('cluster with instance parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        key: 'value',
      },
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        parameterGroup,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'ParameterGroup5E32DECB',
      },
    });
  });

  test('cluster with inline parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        locks: '100',
      },
      instanceProps: {
        vpc,
        parameters: {
          locks: '200',
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: {
        Ref: 'DatabaseParameterGroup2A921026',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        locks: '100',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'DatabaseInstanceParameterGroup6968C5BF',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        locks: '200',
      },
    });
  });

  test('cluster with inline parameter group and parameterGroup arg fails', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseInstanceEngine.sqlServerEe({
        version: SqlServerEngineVersion.VER_11,
      }),
      parameters: {
        locks: '50',
      },
    });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        parameters: {
          locks: '100',
        },
        parameterGroup,
        instanceProps: {
          vpc,
          parameters: {
            locks: '200',
          },
        },
      });
    }).toThrow(/You cannot specify both parameterGroup and parameters/);
  });

  test('instance with inline parameter group and parameterGroup arg fails', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseInstanceEngine.sqlServerEe({
        version: SqlServerEngineVersion.VER_11,
      }),
      parameters: {
        locks: '50',
      },
    });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        parameters: {
          locks: '100',
        },
        instanceProps: {
          vpc,
          parameterGroup,
          parameters: {
            locks: '200',
          },
        },
      });
    }).toThrow(/You cannot specify both parameterGroup and parameters/);
  });

  test('instance with IPv4 network type', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        vpc,
      },
      networkType: NetworkType.IPV4,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      NetworkType: 'IPV4',
    });
  });

  test('instance with dual-stack network type', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        vpc,
      },
      networkType: NetworkType.DUAL,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      NetworkType: 'DUAL',
    });
  });

  describe('performance insights', () => {
    test('cluster with all performance insights properties', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          vpc,
          enablePerformanceInsights: true,
          performanceInsightRetention: PerformanceInsightRetention.LONG_TERM,
          performanceInsightEncryptionKey: new kms.Key(stack, 'Key'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
        EnablePerformanceInsights: true,
        PerformanceInsightsRetentionPeriod: 731,
        PerformanceInsightsKMSKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
      });
    });

    test('setting performance insights fields enables performance insights', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          vpc,
          performanceInsightRetention: PerformanceInsightRetention.LONG_TERM,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
        EnablePerformanceInsights: true,
        PerformanceInsightsRetentionPeriod: 731,
      });
    });

    test('throws if performance insights fields are set but performance insights is disabled', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          credentials: {
            username: 'admin',
          },
          instanceProps: {
            vpc,
            enablePerformanceInsights: false,
            performanceInsightRetention: PerformanceInsightRetention.DEFAULT,
          },
        });
      }).toThrow(/`enablePerformanceInsights` disabled, but `performanceInsightRetention` or `performanceInsightEncryptionKey` was set/);
    });
  });

  test('cluster with disable automatic upgrade of minor version', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        autoMinorVersionUpgrade: false,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      AutoMinorVersionUpgrade: false,
    });
  });

  test('cluster with allow upgrade of major version', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        allowMajorVersionUpgrade: true,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      AllowMajorVersionUpgrade: true,
    });
  });

  test('cluster with disallow remove backups', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        deleteAutomatedBackups: false,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DeleteAutomatedBackups: false,
    });
  });

  test('create a cluster using a specific version of MySQL', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_2_04_4,
      }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-mysql',
      EngineVersion: '5.7.mysql_aurora.2.04.4',
    });
  });

  test('create a cluster using a specific version of Postgresql', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_7,
      }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      EngineVersion: '10.7',
    });
  });

  test('cluster exposes different read and write endpoints', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    expect(stack.resolve(cluster.clusterEndpoint)).not.toEqual(stack.resolve(cluster.clusterReadEndpoint));
  });

  test('imported cluster with imported security group honors allowAllOutbound', () => {
    // GIVEN
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      instanceEndpointAddresses: ['addr'],
      instanceIdentifiers: ['identifier'],
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

  test('can import a cluster with minimal attributes', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(cluster.clusterIdentifier).toEqual('identifier');
  });

  test('minimal imported cluster throws on accessing attributes for unprovided parameters', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(() => cluster.clusterResourceIdentifier).toThrow(/Cannot access `clusterResourceIdentifier` of an imported cluster/);
    expect(() => cluster.clusterEndpoint).toThrow(/Cannot access `clusterEndpoint` of an imported cluster/);
    expect(() => cluster.clusterReadEndpoint).toThrow(/Cannot access `clusterReadEndpoint` of an imported cluster/);
    expect(() => cluster.instanceIdentifiers).toThrow(/Cannot access `instanceIdentifiers` of an imported cluster/);
    expect(() => cluster.instanceEndpoints).toThrow(/Cannot access `instanceEndpoints` of an imported cluster/);
  });

  test('imported cluster can access properties if attributes are provided', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      clusterResourceIdentifier: 'identifier',
      instanceEndpointAddresses: ['instance-addr'],
      instanceIdentifiers: ['identifier'],
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      })],
    });

    expect(cluster.clusterResourceIdentifier).toEqual('identifier');
    expect(cluster.clusterEndpoint.socketAddress).toEqual('addr:3306');
    expect(cluster.clusterReadEndpoint.socketAddress).toEqual('reader-address:3306');
    expect(cluster.instanceIdentifiers).toEqual(['identifier']);
    expect(cluster.instanceEndpoints.map(endpoint => endpoint.socketAddress)).toEqual(['instance-addr:3306']);
  });

  test('cluster supports metrics', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_02_0 }),
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        vpc,
      },
    });

    expect(stack.resolve(cluster.metricCPUUtilization())).toEqual({
      dimensions: { DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' } },
      namespace: 'AWS/RDS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
      account: '12345',
      region: 'us-test-1',
    });
  });

  test('cluster with enabled monitoring', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      monitoringInterval: cdk.Duration.minutes(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        'Fn::GetAtt': ['DatabaseMonitoringRole576991DA', 'Arn'],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'monitoring.rds.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole',
            ],
          ],
        },
      ],
    });
  });

  test('create a cluster with imported monitoring role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const monitoringRole = new Role(stack, 'MonitoringRole', {
      assumedBy: new ServicePrincipal('monitoring.rds.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole'),
      ],
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      monitoringInterval: cdk.Duration.minutes(1),
      monitoringRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        'Fn::GetAtt': ['MonitoringRole90457BF9', 'Arn'],
      },
    });
  });

  test('addRotationSingleUser()', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    cluster.addRotationSingleUser();

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'DatabaseSecretAttachmentE5D1B020',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseRotationSingleUser65F55654',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        AutomaticallyAfterDays: 30,
      },
    });
  });

  test('addRotationMultiUser()', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });
    cluster.addRotationMultiUser('user', { secret: userSecret.attach(cluster) });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'UserSecretAttachment16ACBE6D',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseuserECD1FB0C',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        AutomaticallyAfterDays: 30,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        masterSecretArn: {
          Ref: 'DatabaseSecretAttachmentE5D1B020',
        },
      },
    });
  });

  test('addRotationSingleUser() with custom automaticallyAfter, excludeCharacters, vpcSubnets and securityGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcWithIsolated = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-id',
      availabilityZones: ['az1'],
      publicSubnetIds: ['public-subnet-id-1', 'public-subnet-id-2'],
      publicSubnetNames: ['public-subnet-name-1', 'public-subnet-name-2'],
      privateSubnetIds: ['private-subnet-id-1', 'private-subnet-id-2'],
      privateSubnetNames: ['private-subnet-name-1', 'private-subnet-name-2'],
      isolatedSubnetIds: ['isolated-subnet-id-1', 'isolated-subnet-id-2'],
      isolatedSubnetNames: ['isolated-subnet-name-1', 'isolated-subnet-name-2'],
    });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc: vpcWithIsolated,
    });

    // WHEN
    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcWithIsolated,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in private subnet (internet via NAT)
    cluster.addRotationSingleUser({
      automaticallyAfter: cdk.Duration.days(15),
      excludeCharacters: '°_@',
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        AutomaticallyAfterDays: 15,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        vpcSubnetIds: 'private-subnet-id-1,private-subnet-id-2',
        excludeCharacters: '°_@',
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            stack.getLogicalId(securityGroup.node.defaultChild as ec2.CfnSecurityGroup),
            'GroupId',
          ],
        },
      },
    });
  });

  test('addRotationMultiUser() with custom automaticallyAfter, excludeCharacters, vpcSubnets and securityGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcWithIsolated = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-id',
      availabilityZones: ['az1'],
      publicSubnetIds: ['public-subnet-id-1', 'public-subnet-id-2'],
      publicSubnetNames: ['public-subnet-name-1', 'public-subnet-name-2'],
      privateSubnetIds: ['private-subnet-id-1', 'private-subnet-id-2'],
      privateSubnetNames: ['private-subnet-name-1', 'private-subnet-name-2'],
      isolatedSubnetIds: ['isolated-subnet-id-1', 'isolated-subnet-id-2'],
      isolatedSubnetNames: ['isolated-subnet-name-1', 'isolated-subnet-name-2'],
    });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc: vpcWithIsolated,
    });
    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });

    // WHEN
    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcWithIsolated,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in private subnet (internet via NAT)
    cluster.addRotationMultiUser('user', {
      secret: userSecret.attach(cluster),
      automaticallyAfter: cdk.Duration.days(15),
      excludeCharacters: '°_@',
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        AutomaticallyAfterDays: 15,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        vpcSubnetIds: 'private-subnet-id-1,private-subnet-id-2',
        excludeCharacters: '°_@',
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            stack.getLogicalId(securityGroup.node.defaultChild as ec2.CfnSecurityGroup),
            'GroupId',
          ],
        },
      },
    });
  });

  test('addRotationSingleUser() with VPC interface endpoint', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcIsolatedOnly = new ec2.Vpc(stack, 'Vpc', { natGateways: 0 });

    const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'Endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      vpc: vpcIsolatedOnly,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcIsolatedOnly,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in isolated subnet with access to Secrets Manager API via endpoint
    cluster.addRotationSingleUser({ endpoint });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://',
            { Ref: 'EndpointEEF1FD8F' },
            '.secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        functionName: 'DatabaseRotationSingleUser458A45BE',
        vpcSubnetIds: {
          'Fn::Join': ['', [
            { Ref: 'VpcIsolatedSubnet1SubnetE48C5737' },
            ',',
            { Ref: 'VpcIsolatedSubnet2Subnet16364B91' },
          ]],
        },
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            'DatabaseRotationSingleUserSecurityGroupAC6E0E73',
            'GroupId',
          ],
        },
        excludeCharacters: " %+~`#$&*()|[]{}:;<>?!'/@\"\\",
      },
    });
  });

  test('throws when trying to add rotation to a cluster without secret', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/without a secret/);
  });

  test('throws when trying to add single user rotation multiple times', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: { username: 'admin' },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/A single user rotation was already added to this cluster/);
  });

  test('create a cluster with s3 import role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportRole: associatedRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 import buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('cluster with s3 import bucket adds supported feature name to IAM role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_12,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        FeatureName: 's3Import',
      }],
    });
  });

  test('throws when s3 import bucket or s3 export bucket is supplied for a Postgres version that does not support it', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN / THEN
    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.auroraPostgres({
          version: AuroraPostgresEngineVersion.VER_10_4,
        }),
        instances: 1,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        s3ImportBuckets: [bucket],
      });
    }).toThrow(/s3Import is not supported for Postgres version: 10.4. Use a version that supports the s3Import feature./);

    expect(() => {
      new DatabaseCluster(stack, 'AnotherDatabase', {
        engine: DatabaseClusterEngine.auroraPostgres({
          version: AuroraPostgresEngineVersion.VER_10_4,
        }),
        instances: 1,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        s3ExportBuckets: [bucket],
      });
    }).toThrow(/s3Export is not supported for Postgres version: 10.4. Use a version that supports the s3Export feature./);
  });

  test('cluster with s3 export bucket adds supported feature name to IAM role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_12,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
        FeatureName: 's3Export',
      }],
    });
  });

  test('create a cluster with s3 export role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportRole: associatedRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('create a cluster with s3 import and export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
      {
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 import and export buckets and custom parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        key: 'value',
      },
    });

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup,
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
      {
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        key: 'value',
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });
  });

  test('PostgreSQL cluster with s3 export buckets does not generate custom parameter group and specifies the correct port', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_11_6,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
      DBClusterParameterGroupName: 'default.aurora-postgresql11',
      Port: 5432,
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBClusterParameterGroup', 0);
  });

  test('unversioned PostgreSQL cluster can be used with s3 import and s3 export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql11'),
      s3ImportBuckets: [bucket],
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [
        {
          FeatureName: 's3Import',
          RoleArn: {
            'Fn::GetAtt': [
              'DatabaseS3ImportRole377BC9C0',
              'Arn',
            ],
          },
        },
        {
          FeatureName: 's3Export',
          RoleArn: {
            'Fn::GetAtt': [
              'DatabaseS3ExportRole9E328562',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test("Aurora PostgreSQL cluster uses a different default master username than 'admin', which is a reserved word", () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_9_6_12,
      }),
      instanceProps: { vpc },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        SecretStringTemplate: '{"username":"postgres"}',
      },
    });
  });

  test('MySQL cluster without S3 exports or imports references the correct default ParameterGroup', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: 'default.aurora-mysql5.7',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBClusterParameterGroup', 0);
  });

  test('MySQL cluster in version 8.0 uses aws_default_s3_role as a Parameter for S3 import/export, instead of aurora_load/select_from_s3_role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      instanceProps: { vpc },
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_01_0 }),
      s3ImportBuckets: [new s3.Bucket(stack, 'ImportBucket')],
      s3ExportBuckets: [new s3.Bucket(stack, 'ExportBucket')],
    });

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora-mysql8.0',
      Parameters: {
        aws_default_s3_role: {
          'Fn::GetAtt': ['DatabaseS3ImportRole377BC9C0', 'Arn'],
        },
        aurora_load_from_s3_role: Match.absent(),
        aurora_select_into_s3_role: Match.absent(),
      },
    });
    assert.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('throws when s3ExportRole and s3ExportBuckets properties are both specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const exportRole = new Role(stack, 'ExportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // THEN
    expect(() => new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportRole: exportRole,
      s3ExportBuckets: [exportBucket],
    })).toThrow();
  });

  test('throws when s3ImportRole and s3ImportBuckets properties are both specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const importRole = new Role(stack, 'ImportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const importBucket = new s3.Bucket(stack, 'ImportBucket');

    // THEN
    expect(() => new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportRole: importRole,
      s3ImportBuckets: [importBucket],
    })).toThrow();
  });

  test('can set CloudWatch log exports', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableCloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'],
    });
  });

  test('can set CloudWatch log retention', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      cloudwatchLogsExports: ['error', 'general'],
      cloudwatchLogsRetention: logs.RetentionDays.THREE_MONTHS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      ServiceToken: {
        'Fn::GetAtt': [
          'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
          'Arn',
        ],
      },
      LogGroupName: { 'Fn::Join': ['', ['/aws/rds/cluster/', { Ref: 'DatabaseB269D8BB' }, '/error']] },
      RetentionInDays: 90,
    });
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      ServiceToken: {
        'Fn::GetAtt': [
          'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
          'Arn',
        ],
      },
      LogGroupName: { 'Fn::Join': ['', ['/aws/rds/cluster/', { Ref: 'DatabaseB269D8BB' }, '/general']] },
      RetentionInDays: 90,
    });
  });

  test('throws if given unsupported CloudWatch log exports', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
          password: cdk.SecretValue.unsafePlainText('tooshort'),
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit', 'thislogdoesnotexist', 'neitherdoesthisone'],
      });
    }).toThrow(/Unsupported logs for the current engine type: thislogdoesnotexist,neitherdoesthisone/);
  });

  test('can set deletion protection', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      deletionProtection: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DeletionProtection: true,
    });
  });

  test('does not throw (but adds a node error) if a (dummy) VPC does not have sufficient subnets', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = testStack(app, 'TestStack');
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
        vpcSubnets: {
          subnetName: 'DefinitelyDoesNotExist',
        },
      },
    });

    // THEN
    const art = app.synth().getStackArtifact('TestStack');
    const meta = art.findMetadataByType('aws:cdk:error');
    expect(meta[0].data).toEqual('Cluster requires at least 2 subnets, got 0');
  });

  test('create a cluster from a snapshot', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      iamAuthentication: true,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora',
        EngineVersion: '5.6.mysql_aurora.1.22.2',
        DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
        VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
        SnapshotIdentifier: 'mySnapshot',
        EnableIAMDatabaseAuthentication: true,
        CopyTagsToSnapshot: true,
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBInstance', 2);

    expect(stack.resolve(cluster.clusterResourceIdentifier)).toEqual({ 'Fn::GetAtt': ['DatabaseB269D8BB', 'DBClusterResourceId'] });
    expect(cluster.instanceIdentifiers).toHaveLength(2);
    expect(stack.resolve(cluster.instanceIdentifiers[0])).toEqual({
      Ref: 'DatabaseInstance1844F58FD',
    });

    expect(cluster.instanceEndpoints).toHaveLength(2);
    expect(stack.resolve(cluster.instanceEndpoints[0])).toEqual({
      hostname: {
        'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'],
      },
      port: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
      socketAddress: {
        'Fn::Join': ['', [
          { 'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'] },
          ':',
          { 'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'] },
        ]],
      },
    });

    Annotations.fromStack(stack).hasWarning('/Default/Database', Match.stringLikeRegexp('Generated credentials will not be applied to cluster'));
  });

  test('can generate a new snapshot password', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromGeneratedSecret('admin', {
        excludeCharacters: '"@/\\',
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: Match.absent(),
      MasterUserPassword: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSnapshotSecret2B5748BB8ee0a797cad8a68dbeb85f8698cdb5bb' },
          ':SecretString:password::}}',
        ]],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Description: {
        'Fn::Join': ['', ['Generated by the CDK for stack: ', { Ref: 'AWS::StackName' }]],
      },
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}',
      },
    });
  });

  test('fromGeneratedSecret with replica regions', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromGeneratedSecret('admin', {
        replicaRegions: [{ region: 'eu-west-1' }],
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      ReplicaRegions: [
        {
          Region: 'eu-west-1',
        },
      ],
    });
  });

  test('throws if generating a new password without a username', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    expect(() => new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: { generatePassword: true },
    })).toThrow(/`snapshotCredentials` `username` must be specified when `generatePassword` is set to true/);
  });

  test('can set a new snapshot password from an existing Secret', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const secret = new DatabaseSecret(stack, 'DBSecret', {
      username: 'admin',
      encryptionKey: new kms.Key(stack, 'PasswordKey'),
    });
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromSecret(secret),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: Match.absent(),
      MasterUserPassword: {
        'Fn::Join': ['', ['{{resolve:secretsmanager:', { Ref: 'DBSecretD58955BC' }, ':SecretString:password::}}']],
      },
    });
  });

  test('create a cluster from a snapshot with encrypted storage', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      storageEncryptionKey: kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:us-east-1:456:key/my-key'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      KmsKeyId: 'arn:aws:kms:us-east-1:456:key/my-key',
      StorageEncrypted: true,
    });
  });

  test('create a cluster from a snapshot with single user secret rotation', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        AutomaticallyAfterDays: 30,
      },
    });
  });

  test('throws when trying to add single user rotation multiple times on cluster from snapshot', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/A single user rotation was already added to this cluster/);
  });

  test('create a cluster from a snapshot with multi user secret rotation', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });
    cluster.addRotationMultiUser('user', { secret: userSecret.attach(cluster) });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'UserSecretAttachment16ACBE6D',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseuserECD1FB0C',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        AutomaticallyAfterDays: 30,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        masterSecretArn: {
          Ref: 'DatabaseSecretAttachmentE5D1B020',
        },
      },
    });
  });

  test('reuse an existing subnet group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        vpc,
      },
      subnetGroup: SubnetGroup.fromSubnetGroupName(stack, 'SubnetGroup', 'my-subnet-group'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBSubnetGroupName: 'my-subnet-group',
    });
    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBSubnetGroup', 0);
  });

  test('defaultChild returns the DB Cluster', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        vpc,
      },
    });

    // THEN
    expect(cluster.node.defaultChild instanceof CfnDBCluster).toBeTruthy();
  });

  test('fromGeneratedSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin'),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: 'admin', // username is a string
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecretC9203AE33fdaad7efa858a3daf9490cf0a702aeb', // logical id is a hash
            },
            ':SecretString:password::}}',
          ],
        ],
      },
    });
  });

  test('fromGeneratedSecret with replica regions', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin', {
        replicaRegions: [{ region: 'eu-west-1' }],
      }),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      ReplicaRegions: [
        {
          Region: 'eu-west-1',
        },
      ],
    });
  });

  test('can set custom name to database secret by fromSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secretName = 'custom-secret-name';
    const secret = new DatabaseSecret(stack, 'Secret', {
      username: 'admin',
      secretName,
    } );

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromSecret(secret),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: secretName,
    });
  });

  test('can set custom name to database secret by fromGeneratedSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secretName = 'custom-secret-name';

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin', { secretName }),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: secretName,
    });
  });

  test('can set public accessibility for database cluster with instances in private subnet', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        publiclyAccessible: true,
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('can set public accessibility for database cluster with instances in public subnet', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        publiclyAccessible: false,
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: false,
    });
  });

  test('database cluster instances in public subnet should by default have publiclyAccessible set to true', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('changes the case of the cluster identifier', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const clusterIdentifier = 'TestClusterIdentifier';
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier.toLowerCase(),
    });
  });

  test('does not changes the case of the cluster identifier if the lowercaseDbIdentifier feature flag is disabled', () => {
    // GIVEN
    const app = new cdk.App({ context: { '@aws-cdk/aws-rds:lowercaseDbIdentifier': false } });
    const stack = testStack(app);
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const clusterIdentifier = 'TestClusterIdentifier';
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier,
    });
  });

  test('cluster with copyTagsToSnapshot default', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

  test('cluster with copyTagsToSnapshot disabled', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
      copyTagsToSnapshot: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: false,
    });
  });

  test('cluster with copyTagsToSnapshot enabled', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      copyTagsToSnapshot: true,
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

  test('cluster has BacktrackWindow in seconds', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
      backtrackWindow: cdk.Duration.days(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      BacktrackWindow: 24 * 60 * 60,
    });
  });

  test('DB instances should not have engine version set when part of a cluster', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_14_3 }),
      instanceProps: { vpc },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      EngineVersion: Match.absent(),
    });
  });
});

test.each([
  [cdk.RemovalPolicy.RETAIN, 'Retain', 'Retain', 'Retain'],
  [cdk.RemovalPolicy.SNAPSHOT, 'Snapshot', 'Delete', Match.absent()],
  [cdk.RemovalPolicy.DESTROY, 'Delete', 'Delete', Match.absent()],
])('if Cluster RemovalPolicy is \'%s\', the DBCluster has DeletionPolicy \'%s\', the DBInstance has \'%s\' and the DBSubnetGroup has \'%s\'', (clusterRemovalPolicy, clusterValue, instanceValue, subnetValue) => {
  const stack = new cdk.Stack();

  // WHEN
  new DatabaseCluster(stack, 'Cluster', {
    credentials: { username: 'admin' },
    engine: DatabaseClusterEngine.AURORA,
    instanceProps: {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc: new ec2.Vpc(stack, 'Vpc'),
    },
    removalPolicy: clusterRemovalPolicy,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
    DeletionPolicy: clusterValue,
    UpdateReplacePolicy: clusterValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
    DeletionPolicy: instanceValue,
    UpdateReplacePolicy: instanceValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
    DeletionPolicy: subnetValue,
  });
});

test.each([
  [cdk.RemovalPolicy.RETAIN, 'Retain', 'Retain', 'Retain'],
  [cdk.RemovalPolicy.SNAPSHOT, 'Snapshot', 'Delete', Match.absent()],
  [cdk.RemovalPolicy.DESTROY, 'Delete', 'Delete', Match.absent()],
])('if Cluster RemovalPolicy is \'%s\', the DBCluster has DeletionPolicy \'%s\', the DBInstance has \'%s\' and the DBSubnetGroup has \'%s\'', (clusterRemovalPolicy, clusterValue, instanceValue, subnetValue) => {
  const stack = new cdk.Stack();

  // WHEN
  new DatabaseCluster(stack, 'Cluster', {
    credentials: { username: 'admin' },
    engine: DatabaseClusterEngine.AURORA,
    instanceProps: {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc: new ec2.Vpc(stack, 'Vpc'),
    },
    removalPolicy: clusterRemovalPolicy,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
    DeletionPolicy: clusterValue,
    UpdateReplacePolicy: clusterValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
    DeletionPolicy: instanceValue,
    UpdateReplacePolicy: instanceValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
    DeletionPolicy: subnetValue,
    UpdateReplacePolicy: subnetValue,
  });
});

function testStack(app?: cdk.App, stackId?: string) {
  const stack = new cdk.Stack(app, stackId, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
