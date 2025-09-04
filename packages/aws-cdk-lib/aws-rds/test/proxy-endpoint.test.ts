import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as rds from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

describe('Proxy endpoint', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('create a DB proxy from an instance', () => {
    // GIVEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_4_5,
      }),
      vpc,
    });

    const dbProxy = new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // WHEN
    new rds.DatabaseProxyEndpoint(stack, 'ProxyEndpoint', {
      dbProxy,
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyEndpoint', {
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
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

  test('can specify targetRole', () => {
    // GIVEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_4_5,
      }),
      vpc,
    });

    const dbProxy = new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    // WHEN
    new rds.DatabaseProxyEndpoint(stack, 'ProxyEndpoint', {
      dbProxy,
      vpc,
      targetRole: rds.ProxyEndpointTargetRole.READ_ONLY,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyEndpoint', {
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      TargetRole: 'READ_ONLY',
    });
  });

  test('can specify security group', () => {
    // GIVEN
    const instance = new rds.DatabaseInstance(stack, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_4_5,
      }),
      vpc,
    });

    const dbProxy = new rds.DatabaseProxy(stack, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(instance),
      secrets: [instance.secret!],
      vpc,
    });

    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });

    // WHEN
    new rds.DatabaseProxyEndpoint(stack, 'ProxyEndpoint', {
      dbProxyEndpointName: 'test',
      dbProxy,
      vpc,
      securityGroups: [securityGroup],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBProxyEndpoint', {
      DBProxyEndpointName: 'test',
      DBProxyName: {
        Ref: 'ProxyCB0DFB71',
      },
      VpcSubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      VpcSecurityGroupIds: [
        {
          'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'],
        },
      ],
    });
  });

  test('throw when security group empty', () => {
    expect(() => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_8_4_5,
        }),
        vpc,
      });

      const dbProxy = new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromInstance(instance),
        secrets: [instance.secret!],
        vpc,
      });

      new rds.DatabaseProxyEndpoint(stack, 'ProxyEndpoint', {
        dbProxy,
        vpc,
        securityGroups: [],
      });
    }).toThrow(/`securityGroups` must be undefined or a non-empty array/);
  });

  test('throw when less than 2 subnets', () => {
    expect(() => {
      // GIVEN
      const instance = new rds.DatabaseInstance(stack, 'Instance', {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_8_4_5,
        }),
        vpc,
      });

      const dbProxy = new rds.DatabaseProxy(stack, 'Proxy', {
        proxyTarget: rds.ProxyTarget.fromInstance(instance),
        secrets: [instance.secret!],
        vpc,
      });

      new rds.DatabaseProxyEndpoint(stack, 'ProxyEndpoint', {
        dbProxy,
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnets: [vpc.privateSubnets[0]] }),
      });
    }).toThrow(/`subnets` requires at least 2 subnets/);
  });
});
