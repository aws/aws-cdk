import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { VpcConnector } from '../lib';

test('create a vpcConnector with all properties', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    cidr: '10.0.0.0/16',
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    securityGroups: [securityGroup],
    subnets: vpc.publicSubnets,
    vpcConnectorName: 'MyVpcConnector',
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
    ],
    VpcConnectorName: 'MyVpcConnector',
  });
});

test('create a vpcConnector without a name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'Vpc', {
    cidr: '10.0.0.0/16',
  });

  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
  // WHEN
  new VpcConnector(stack, 'VpcConnector', {
    securityGroups: [securityGroup],
    subnets: vpc.publicSubnets,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcConnector', {
    Subnets: [
      {
        Ref: 'VpcPublicSubnet1Subnet5C2D37C4',
      },
      {
        Ref: 'VpcPublicSubnet2Subnet691E08A3',
      },
    ],
    SecurityGroups: [
      {
        'Fn::GetAtt': [
          'SecurityGroupDD263621',
          'GroupId',
        ],
      },
    ],
  });
});