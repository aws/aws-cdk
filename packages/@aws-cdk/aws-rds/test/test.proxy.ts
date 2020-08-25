import { ABSENT, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as rds from '../lib';

export = {
  'create a DB proxy from an instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
      masterUsername: 'admin',
      vpc,
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBProxy', {
      Properties: {
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
      },
    }, ResourcePart.CompleteDefinition));

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBProxyTargetGroup', {
      Properties: {
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
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'create a DB proxy from a cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_7,
      }),
      masterUser: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(cluster),
      secrets: [cluster.secret!],
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBProxy', {
      Properties: {
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
      },
    }, ResourcePart.CompleteDefinition));

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBProxyTargetGroup', {
      Properties: {
        DBProxyName: {
          Ref: 'ProxyCB0DFB71',
        },
        ConnectionPoolConfigurationInfo: {},
        DBClusterIdentifiers: [
          {
            Ref: 'DatabaseB269D8BB',
          },
        ],
        TargetGroupName: 'default',
      },
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Cannot specify both dbInstanceIdentifiers and dbClusterIdentifiers'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_7,
      }),
      masterUser: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    test.doesNotThrow(() => {
      new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromCluster(cluster),
        secrets: [cluster.secret!],
        vpc,
      });
    }, /Cannot specify both dbInstanceIdentifiers and dbClusterIdentifiers/);

    expect(stack).to(haveResource('AWS::RDS::DBProxyTargetGroup', {
      DBInstanceIdentifiers: ABSENT,
    }, ResourcePart.Properties));

    test.done();
  },

  'One or more secrets are required.'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new rds.DatabaseCluster(stack, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_10_7 }),
      masterUser: { username: 'admin' },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
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
};
