import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { AccountPrincipal, Role } from '../../aws-iam';
import * as secretsmanager from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as rds from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

let importedDbProxy: rds.IDatabaseProxy;

describe('proxy', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('create a DB proxy from an instance', () => {
    // GIVEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7,
      }),
      vpc,
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
      Auth: [
        {
          AuthScheme: 'SECRETS',
          IAMAuth: 'DISABLED',
          SecretArn: {
            Ref: 'InstanceSecretAttachment83BEE581',
          },
        },
      ],
      DBProxyName: 'Proxy',
      EngineFamily: 'MYSQL',
      RequireTLS: true,
      RoleArn: {
        'Fn::GetAtt': [
          'ProxyIAMRole2FE8AB0F',
          'Arn',
        ],
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyTargetGroup', {
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
      },
      ConnectionPoolConfigurationInfo: {},
      DBInstanceIdentifiers: [
        {
          Ref: 'InstanceC1063A87',
        },
      ],
      TargetGroupName: 'default',
    });
  });

  test('create a DB proxy from a cluster', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_7,
      }),
      instanceProps: { vpc },
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [cluster.secret!],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
      Auth: [
        {
          AuthScheme: 'SECRETS',
          IAMAuth: 'DISABLED',
          SecretArn: {
            Ref: 'DatabaseSecretAttachmentE5D1B020',
          },
        },
      ],
      DBProxyName: 'Proxy',
      EngineFamily: 'POSTGRESQL',
      RequireTLS: true,
      RoleArn: {
        'Fn::GetAtt': [
          'ProxyIAMRole2FE8AB0F',
          'Arn',
        ],
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyTargetGroup', {
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
      },
      ConnectionPoolConfigurationInfo: {},
      DBClusterIdentifiers: [
        {
          Ref: 'DatabaseB269D8BB',
        },
      ],
      DBInstanceIdentifiers: Match.absent(),
      TargetGroupName: 'default',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'Allow connections to the database Cluster from the Proxy',
      FromPort: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
      GroupId: {
        'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': ['ProxyProxySecurityGroupC42FC3CE', 'GroupId'],
      },
      ToPort: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
    });
  });

  test('One or more secrets are required.', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_10_7 }),
      instanceProps: { vpc },
    });

    // WHEN
    expect(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromCluster(cluster),
        secrets: [], // No secret
        vpc,
      });
    }).toThrow('One or more secrets are required.');
  });

  test('fails when trying to create a proxy for a target without an engine', () => {
    const importedCluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Cluster', {
      clusterIdentifier: 'my-cluster',
    });

    expect(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromCluster(importedCluster),
        vpc,
        secrets: [new secretsmanager.Secret(stack, 'Secret')],
      });
    }).toThrow(/Could not determine engine for proxy target 'Default\/Cluster'\. Please provide it explicitly when importing the resource/);
  });

  test("fails when trying to create a proxy for a target with an engine that doesn't have engineFamily", () => {
    const importedInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Cluster', {
      instanceIdentifier: 'my-instance',
      instanceEndpointAddress: 'instance-address',
      port: 5432,
      securityGroups: [],
      engine: rds.DatabaseInstanceEngine.mariaDb({
        version: rds.MariaDbEngineVersion.VER_10_0_24,
      }),
    });

    expect(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromInstance(importedInstance),
        vpc,
        secrets: [new secretsmanager.Secret(stack, 'Secret')],
      });
    }).toThrow(/Engine 'mariadb-10\.0\.24' does not support proxies/);
  });

  test('correctly creates a proxy for an imported Cluster if its engine is known', () => {
    const importedCluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Cluster', {
      clusterIdentifier: 'my-cluster',
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_9_6_11,
      }),
      port: 5432,
    });

    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(importedCluster),
      vpc,
      secrets: [new secretsmanager.Secret(stack, 'Secret')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
      EngineFamily: 'POSTGRESQL',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyTargetGroup', {
      DBClusterIdentifiers: [
        'my-cluster',
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'SecurityGroup for Database Proxy',
      VpcId: { Ref: 'VPCB9E5F0B4' },
    });
  });

  describe('imported Proxies', () => {
    beforeEach(() => {
      importedDbProxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(stack, 'Proxy', {
        dbProxyName: 'my-proxy',
        dbProxyArn: 'arn:aws:rds:us-east-1:123456789012:db-proxy:prx-1234abcd',
        endpoint: 'my-endpoint',
        securityGroups: [],
      });
    });

    test('grant rds-db:connect in grantConnect() with a dbUser explicitly passed', () => {
      // WHEN
      const role = new Role(stack, 'DBProxyRole', {
        assumedBy: new AccountPrincipal(stack.account),
      });
      const databaseUser = 'test';
      importedDbProxy.grantConnect(role, databaseUser);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: 'rds-db:connect',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':rds-db:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':dbuser:prx-1234abcd/test',
              ]],
            },
          }],
          Version: '2012-10-17',
        },
      });
    });

    test('throws when grantConnect() is used without a dbUser', () => {
      // WHEN
      const role = new Role(stack, 'DBProxyRole', {
        assumedBy: new AccountPrincipal(stack.account),
      });

      // THEN
      expect(() => {
        importedDbProxy.grantConnect(role);
      }).toThrow(/For imported Database Proxies, the dbUser is required in grantConnect/);
    });
  });

  test('new Proxy with a single Secret can use grantConnect() without a dbUser passed', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
    });

    const proxy = new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [cluster.secret!],
      vpc,
    });

    // WHEN
    const role = new Role(stack, 'DBProxyRole', {
      assumedBy: new AccountPrincipal(stack.account),
    });
    proxy.grantConnect(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: 'rds-db:connect',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':rds-db:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':dbuser:',
              {
                'Fn::Select': [
                  6,
                  {
                    'Fn::Split': [
                      ':',
                      { 'Fn::GetAtt': ['ProxyCB0DFB71', 'DBProxyArn'] },
                    ],
                  },
                ],
              },
              '/{{resolve:secretsmanager:',
              { Ref: 'DatabaseSecretAttachmentE5D1B020' },
              ':SecretString:username::}}',
            ]],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('new Proxy with multiple Secrets cannot use grantConnect() without a dbUser passed', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
    });

    const proxy = new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [
        cluster.secret!,
        new secretsmanager.Secret(stack, 'ProxySecret'),
      ],
      vpc,
    });

    // WHEN
    const role = new Role(stack, 'DBProxyRole', {
      assumedBy: new AccountPrincipal(stack.account),
    });

    // THEN
    expect(() => {
      proxy.grantConnect(role);
    }).toThrow(/When the Proxy contains multiple Secrets, you must pass a dbUser explicitly to grantConnect/);
  });

  test('DBProxyTargetGroup should have dependency on the proxy targets', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'cluster', {
      engine: rds.DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
    });

    //WHEN
    new rds.DatabaseProxy(stack, 'proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [cluster.secret!],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBProxyTargetGroup', {
      Properties: {
        DBProxyName: {
          Ref: 'proxy3A1DA9C7',
        },
        TargetGroupName: 'default',
      },
      DependsOn: [
        'clusterInstance183584D40',
        'clusterInstance23D1AD8B2',
        'cluster611F8AFF',
      ],
    });
  });

  test('Correct dependencies are created when multiple DatabaseProxy are created with addProxy', () => {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'cluster', {
      engine: rds.DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
    });

    //WHEN
    cluster.addProxy('Proxy', {
      vpc,
      secrets: [cluster.secret!],
    });
    cluster.addProxy('Proxy2', {
      vpc,
      secrets: [cluster.secret!],
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBProxyTargetGroup', {
      Properties: {
        DBProxyName: {
          Ref: 'clusterProxy22303E35D',
        },
        TargetGroupName: 'default',
      },
      DependsOn: [
        'clusterInstance183584D40',
        'clusterInstance23D1AD8B2',
        'cluster611F8AFF',
      ],
    });
    Template.fromStack(stack).hasResource('AWS::RDS::DBProxyTargetGroup', {
      Properties: {
        DBProxyName: {
          Ref: 'clusterProxyC4BEF551',
        },
        TargetGroupName: 'default',
      },
      DependsOn: [
        'clusterInstance183584D40',
        'clusterInstance23D1AD8B2',
        'cluster611F8AFF',
      ],
    });
  });

  describe('clientPasswordAuthType', () => {
    test('create a DB proxy with specified client password authentication type', () => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_5_7,
        }),
        vpc,
      });

      // WHEN
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromInstance(instance),
        secrets: [instance.secret!],
        vpc,
        clientPasswordAuthType: rds.ClientPasswordAuthType.MYSQL_NATIVE_PASSWORD,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
        Auth: [
          {
            AuthScheme: 'SECRETS',
            IAMAuth: 'DISABLED',
            ClientPasswordAuthType: 'MYSQL_NATIVE_PASSWORD',
            SecretArn: {
              Ref: 'InstanceSecretAttachment83BEE581',
            },
          },
        ],
        DBProxyName: 'Proxy',
        EngineFamily: 'MYSQL',
        RequireTLS: true,
        RoleArn: {
          'Fn::GetAtt': [
            'ProxyIAMRole2FE8AB0F',
            'Arn',
          ],
        },
        VpcSubnetIds: [
          {
            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
          },
          {
            Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
          },
        ],
      });
    });

    test('MYSQL_NATIVE_PASSWORD clientPasswordAuthType requires MYSQL engine family', () => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_11,
        }),
        vpc,
      });

      // WHEN
      // THEN
      expect(() => {
        new rds.DatabaseProxy(stack, 'Proxy', {
          proxyTarget: rds.ProxyTarget.fromInstance(instance),
          secrets: [instance.secret!],
          vpc,
          clientPasswordAuthType: rds.ClientPasswordAuthType.MYSQL_NATIVE_PASSWORD,
        });
      }).toThrow(/MYSQL_NATIVE_PASSWORD client password authentication type requires MYSQL engineFamily, got POSTGRESQL/);
    });

    test('POSTGRES_SCRAM_SHA_256 clientPasswordAuthType requires POSTGRESQL engine family', () => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_5_7,
        }),
        vpc,
      });

      // WHEN
      // THEN
      expect(() => {
        new rds.DatabaseProxy(stack, 'Proxy', {
          proxyTarget: rds.ProxyTarget.fromInstance(instance),
          secrets: [instance.secret!],
          vpc,
          clientPasswordAuthType: rds.ClientPasswordAuthType.POSTGRES_SCRAM_SHA_256,
        });
      }).toThrow(/POSTGRES_SCRAM_SHA_256 client password authentication type requires POSTGRESQL engineFamily, got MYSQL/);
    });

    test('POSTGRES_MD5 clientPasswordAuthType requires POSTGRESQL engine family', () => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_5_7,
        }),
        vpc,
      });

      // WHEN
      // THEN
      expect(() => {
        new rds.DatabaseProxy(stack, 'Proxy', {
          proxyTarget: rds.ProxyTarget.fromInstance(instance),
          secrets: [instance.secret!],
          vpc,
          clientPasswordAuthType: rds.ClientPasswordAuthType.POSTGRES_MD5,
        });
      }).toThrow(/POSTGRES_MD5 client password authentication type requires POSTGRESQL engineFamily, got MYSQL/);
    });

    test('SQL_SERVER_AUTHENTICATION clientPasswordAuthType requires SQLSERVER engine family', () => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_5_7,
        }),
        vpc,
      });

      // WHEN
      // THEN
      expect(() => {
        new rds.DatabaseProxy(stack, 'Proxy', {
          proxyTarget: rds.ProxyTarget.fromInstance(instance),
          secrets: [instance.secret!],
          vpc,
          clientPasswordAuthType: rds.ClientPasswordAuthType.SQL_SERVER_AUTHENTICATION,
        });
      }).toThrow(/SQL_SERVER_AUTHENTICATION client password authentication type requires SQLSERVER engineFamily, got MYSQL/);
    });
  });
});

describe('feature flag @aws-cdk/aws-rds:databaseProxyUniqueResourceName', () => {
  test('create a DB proxy from an instance with a unique resource name', () => {
    // GIVEN
    stack = new cdk.Stack();
    stack.node.setContext(cxapi.DATABASE_PROXY_UNIQUE_RESOURCE_NAME, true);
    vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7,
      }),
      vpc,
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
      Auth: [
        {
          AuthScheme: 'SECRETS',
          IAMAuth: 'DISABLED',
          SecretArn: {
            Ref: 'InstanceSecretAttachment83BEE581',
          },
        },
      ],
      DBProxyName: 'Proxy',
      EngineFamily: 'MYSQL',
      RequireTLS: true,
      RoleArn: {
        'Fn::GetAtt': [
          'ProxyIAMRole2FE8AB0F',
          'Arn',
        ],
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
    });
  });

  test('create a DB proxy from an instance with a proxy name in the constructor', () => {
    // GIVEN
    stack = new cdk.Stack();
    stack.node.setContext(cxapi.DATABASE_PROXY_UNIQUE_RESOURCE_NAME, true);
    vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7,
      }),
      vpc,
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      dbProxyName: 'my-proxy-name',
      secrets: [instance.secret!],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxy', {
      Auth: [
        {
          AuthScheme: 'SECRETS',
          IAMAuth: 'DISABLED',
          SecretArn: {
            Ref: 'InstanceSecretAttachment83BEE581',
          },
        },
      ],
      DBProxyName: 'my-proxy-name',
      EngineFamily: 'MYSQL',
      RequireTLS: true,
      RoleArn: {
        'Fn::GetAtt': [
          'ProxyIAMRole2FE8AB0F',
          'Arn',
        ],
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
    });
  });
});
