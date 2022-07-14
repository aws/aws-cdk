import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

describe('subnet group', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('creates a subnet group from minimal properties', () => {
    new rds.SubnetGroup(stack, 'Group', {
      description: 'MyGroup',
      vpc,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'MyGroup',
      SubnetIds: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
      ],
    });
  });

  test('creates a subnet group from all properties', () => {
    new rds.SubnetGroup(stack, 'Group', {
      description: 'My Shared Group',
      subnetGroupName: 'SharedGroup',
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'My Shared Group',
      DBSubnetGroupName: 'sharedgroup',
      SubnetIds: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
      ],
    });
  });

  test('correctly creates a subnet group with a deploy-time value for its name', () => {
    const parameter = new cdk.CfnParameter(stack, 'Parameter');
    new rds.SubnetGroup(stack, 'Group', {
      description: 'My Shared Group',
      subnetGroupName: parameter.valueAsString,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupName: {
        Ref: 'Parameter',
      },
    });
  });

  describe('subnet selection', () => {
    test('defaults to private subnets', () => {
      new rds.SubnetGroup(stack, 'Group', {
        description: 'MyGroup',
        vpc,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'MyGroup',
        SubnetIds: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      });
    });

    test('can specify subnet type', () => {
      new rds.SubnetGroup(stack, 'Group', {
        description: 'MyGroup',
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'MyGroup',
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
        ],
      });
    });
  });

  test('import group by name', () => {
    const subnetGroup = rds.SubnetGroup.fromSubnetGroupName(stack, 'Group', 'my-subnet-group');

    expect(subnetGroup.subnetGroupName).toEqual('my-subnet-group');
  });
});
