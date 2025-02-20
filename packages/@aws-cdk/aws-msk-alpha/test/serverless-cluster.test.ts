import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as core from 'aws-cdk-lib';
import * as msk from '../lib';

describe('MSK Serverless Cluster', () => {
  let stack: core.Stack;
  let vpc: ec2.IVpc;

  beforeEach(() => {
    stack = new core.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('creates a serverless cluster with minimal properties', () => {
    new msk.ServerlessCluster(stack, 'ServerlessCluster', {
      vpcConfigs: [{
        vpc,
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::MSK::ServerlessCluster', {
      ClusterName: 'ServerlessCluster',
      ClientAuthentication: {
        Sasl: {
          Iam: {
            Enabled: true,
          },
        },
      },
      VpcConfigs: [{
        SubnetIds: [
          { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
          { Ref: 'VpcPrivateSubnet2Subnet3788AAA1' },
        ],
        SecurityGroups: [
          { 'Fn::GetAtt': ['ServerlessClusterSecurityGroup0535E269F', 'GroupId'] },
        ],
      }],
    });
  });

  test('creates a serverless cluster with multiple VPC configurations', () => {
    const anotherVpc = new ec2.Vpc(stack, 'AnotherVpc');
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc,
    });
    const anotherSecurityGroup1 = new ec2.SecurityGroup(stack, 'AnotherSecurityGroup1', {
      vpc: anotherVpc,
    });
    const anotherSecurityGroup2 = new ec2.SecurityGroup(stack, 'AnotherSecurityGroup2', {
      vpc: anotherVpc,
    });

    new msk.ServerlessCluster(stack, 'ServerlessCluster', {
      clusterName: 'MyServerlessCluster',
      vpcConfigs: [
        {
          vpc,
          vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
          securityGroups: [securityGroup],
        },
        {
          vpc: anotherVpc,
          securityGroups: [anotherSecurityGroup1, anotherSecurityGroup2],
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::MSK::ServerlessCluster', {
      ClusterName: 'MyServerlessCluster',
      ClientAuthentication: {
        Sasl: {
          Iam: {
            Enabled: true,
          },
        },
      },
      VpcConfigs: [
        {
          SubnetIds: [
            { Ref: 'VpcPublicSubnet1Subnet5C2D37C4' },
            { Ref: 'VpcPublicSubnet2Subnet691E08A3' },
          ],
          SecurityGroups: [
            stack.resolve(securityGroup.securityGroupId),
          ],
        },
        {
          SubnetIds: [
            { Ref: 'AnotherVpcPrivateSubnet1SubnetA8BEDDE4' },
            { Ref: 'AnotherVpcPrivateSubnet2Subnet66A0F53A' },
          ],
          SecurityGroups: [
            stack.resolve(anotherSecurityGroup1.securityGroupId),
            stack.resolve(anotherSecurityGroup2.securityGroupId),
          ],
        },
      ],
    });
  });

  test('throws error when VPC configurations are empty', () => {
    expect(() =>
      new msk.ServerlessCluster(stack, 'ServerlessCluster', {
        vpcConfigs: [],
      }),
    ).toThrow('`vpcConfigs` must contain between 1 and 5 configurations, got 0 configurations.');
  });

  test('throws error when VPC configurations exceed the limit of 5', () => {
    const vpc1 = new ec2.Vpc(stack, 'Vpc1');
    const vpc2 = new ec2.Vpc(stack, 'Vpc2');
    const vpc3 = new ec2.Vpc(stack, 'Vpc3');
    const vpc4 = new ec2.Vpc(stack, 'Vpc4');
    const vpc5 = new ec2.Vpc(stack, 'Vpc5');
    const vpc6 = new ec2.Vpc(stack, 'Vpc6');

    expect(() =>
      new msk.ServerlessCluster(stack, 'ServerlessCluster', {
        vpcConfigs: [
          { vpc: vpc1 },
          { vpc: vpc2 },
          { vpc: vpc3 },
          { vpc: vpc4 },
          { vpc: vpc5 },
          { vpc: vpc6 },
        ],
      }),
    ).toThrow('`vpcConfigs` must contain between 1 and 5 configurations, got 6 configurations.');
  });

  test('throws an error when `securityGroups` in `vpcConfig` is empty', () => {
    expect(() =>
      new msk.ServerlessCluster(stack, 'ServerlessCluster', {
        vpcConfigs: [
          {
            vpc,
            securityGroups: [
            ],
          },
        ],
      }),
    ).toThrow('`securityGroups` must contain between 1 and 5 elements, got 0 elements.');
  });

  test('throws error when a single `vpcConfig` has more than 5 security groups', () => {
    const securityGroup1 = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
      vpc,
    });
    const securityGroup2 = new ec2.SecurityGroup(stack, 'SecurityGroup2', {
      vpc,
    });
    const securityGroup3 = new ec2.SecurityGroup(stack, 'SecurityGroup3', {
      vpc,
    });
    const securityGroup4 = new ec2.SecurityGroup(stack, 'SecurityGroup4', {
      vpc,
    });
    const securityGroup5 = new ec2.SecurityGroup(stack, 'SecurityGroup5', {
      vpc,
    });
    const securityGroup6 = new ec2.SecurityGroup(stack, 'SecurityGroup6', {
      vpc,
    });

    expect(() =>
      new msk.ServerlessCluster(stack, 'ServerlessCluster', {
        vpcConfigs: [
          {
            vpc,
            securityGroups: [
              securityGroup1,
              securityGroup2,
              securityGroup3,
              securityGroup4,
              securityGroup5,
              securityGroup6,
            ],
          },
        ],
      }),
    ).toThrow('`securityGroups` must contain between 1 and 5 elements, got 6 elements.');
  });

  test('throws error when a single VPC configuration has fewer than 2 subnets', () => {
    const vpc1Az = new ec2.Vpc(stack, 'VPC1Az', {
      maxAzs: 1,
    });

    expect(() =>
      new msk.ServerlessCluster(stack, 'ServerlessCluster', {
        vpcConfigs: [
          { vpc: vpc1Az },
        ],
      }),
    ).toThrow('Cluster requires at least 2 subnets, got 1 subnet.');
  });

  test('imports an existing serverless cluster by ARN', () => {
    const clusterArn = 'arn:aws:kafka:us-east-1:111111111111:cluster/MyServerlessCluster/11111111-1111-1111-1111-111111111111-1';

    const serverlessCluster = msk.ServerlessCluster.fromClusterArn(stack, 'ServerlessCluster', clusterArn);

    expect(serverlessCluster.clusterName).toEqual('MyServerlessCluster');
    expect(serverlessCluster.clusterArn).toEqual(clusterArn);
  });
});
