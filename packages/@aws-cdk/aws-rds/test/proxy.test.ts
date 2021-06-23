import { ABSENT, expect, haveResourceLike, ResourcePart } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import { AccountPrincipal, Role } from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as rds from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

let importedDbProxy: rds.IDatabaseProxy;

nodeunitShim({
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');

    cb();
  },

  'create a DB proxy from an instance'(test: Test) {
    // GIVEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc,
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxy', {
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
    }));

    // THEN
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxyTargetGroup', {
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
    }));

    test.done();
  },

  'create a DB proxy from a cluster'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxy', {
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
    }));
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxyTargetGroup', {
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
      },
      ConnectionPoolConfigurationInfo: {},
      DBClusterIdentifiers: [
        {
          Ref: 'DatabaseB269D8BB',
        },
      ],
      DBInstanceIdentifiers: ABSENT,
      TargetGroupName: 'default',
    }));
    expect(stack).to(haveResourceLike('AWS::EC2::SecurityGroupIngress', {
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
    }));

    test.done();
  },

  'One or more secrets are required.'(test: Test) {
    // GIVEN
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_10_7 }),
      instanceProps: { vpc },
    });

    // WHEN
    test.throws(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromCluster(cluster),
        secrets: [], // No secret
        vpc,
      });
    }, 'One or more secrets are required.');

    test.done();
  },

  'fails when trying to create a proxy for a target without an engine'(test: Test) {
    const importedCluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Cluster', {
      clusterIdentifier: 'my-cluster',
    });

    test.throws(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromCluster(importedCluster),
        vpc,
        secrets: [new secretsmanager.Secret(stack, 'Secret')],
      });
    }, /Could not determine engine for proxy target 'Default\/Cluster'\. Please provide it explicitly when importing the resource/);

    test.done();
  },

  "fails when trying to create a proxy for a target with an engine that doesn't have engineFamily"(test: Test) {
    const importedInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Cluster', {
      instanceIdentifier: 'my-instance',
      instanceEndpointAddress: 'instance-address',
      port: 5432,
      securityGroups: [],
      engine: rds.DatabaseInstanceEngine.mariaDb({
        version: rds.MariaDbEngineVersion.VER_10_0_24,
      }),
    });

    test.throws(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromInstance(importedInstance),
        vpc,
        secrets: [new secretsmanager.Secret(stack, 'Secret')],
      });
    }, /Engine 'mariadb-10\.0\.24' does not support proxies/);

    test.done();
  },

  'correctly creates a proxy for an imported Cluster if its engine is known'(test: Test) {
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

    expect(stack).to(haveResourceLike('AWS::RDS::DBProxy', {
      EngineFamily: 'POSTGRESQL',
    }));
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxyTargetGroup', {
      DBClusterIdentifiers: [
        'my-cluster',
      ],
    }));
    expect(stack).to(haveResourceLike('AWS::EC2::SecurityGroup', {
      GroupDescription: 'SecurityGroup for Database Proxy',
      VpcId: { Ref: 'VPCB9E5F0B4' },
    }));

    test.done();
  },

  'imported Proxies': {
    'setUp'(cb: () => void) {
      importedDbProxy = rds.DatabaseProxy.fromDatabaseProxyAttributes(stack, 'Proxy', {
        dbProxyName: 'my-proxy',
        dbProxyArn: 'arn:aws:rds:us-east-1:123456789012:db-proxy:prx-1234abcd',
        endpoint: 'my-endpoint',
        securityGroups: [],
      });

      cb();
    },

    'grant rds-db:connect in grantConnect() with a dbUser explicitly passed'(test: Test) {
      // WHEN
      const role = new Role(stack, 'DBProxyRole', {
        assumedBy: new AccountPrincipal(stack.account),
      });
      const databaseUser = 'test';
      importedDbProxy.grantConnect(role, databaseUser);

      // THEN
      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
      }));

      test.done();
    },

    'throws when grantConnect() is used without a dbUser'(test: Test) {
      // WHEN
      const role = new Role(stack, 'DBProxyRole', {
        assumedBy: new AccountPrincipal(stack.account),
      });

      // THEN
      test.throws(() => {
        importedDbProxy.grantConnect(role);
      }, /For imported Database Proxies, the dbUser is required in grantConnect/);

      test.done();
    },
  },

  'new Proxy with a single Secret can use grantConnect() without a dbUser passed'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'new Proxy with multiple Secrets cannot use grantConnect() without a dbUser passed'(test: Test) {
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
    test.throws(() => {
      proxy.grantConnect(role);
    }, /When the Proxy contains multiple Secrets, you must pass a dbUser explicitly to grantConnect/);

    test.done();
  },

  'DBProxyTargetGroup should have dependency on the proxy targets'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::RDS::DBProxyTargetGroup', {
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
        'clusterSecretAttachment69BFCEC4',
        'clusterSecretE349B730',
        'clusterSecurityGroupfromproxyProxySecurityGroupA80F0525IndirectPortA13E5F3D',
        'clusterSecurityGroupF441DCEA',
        'clusterSubnets81E3593F',
      ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
});
