import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as rds from '../lib';

let stack: cdk.Stack;
let vpc: ec2.IVpc;

nodeunitShim({
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
    cb();
  },

  'creates a subnet group from minimal properties'(test: Test) {
    new rds.SubnetGroup(stack, 'Group', {
      description: 'MyGroup',
      vpc,
    });

    expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'MyGroup',
      SubnetIds: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
      ],
    }));

    test.done();
  },

  'creates a subnet group from all properties'(test: Test) {
    new rds.SubnetGroup(stack, 'Group', {
      description: 'My Shared Group',
      subnetGroupName: 'SharedGroup',
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE },
    });

    expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'My Shared Group',
      DBSubnetGroupName: 'SharedGroup',
      SubnetIds: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
      ],
    }));

    test.done();
  },

  'subnet selection': {
    'defaults to private subnets'(test: Test) {
      new rds.SubnetGroup(stack, 'Group', {
        description: 'MyGroup',
        vpc,
      });

      expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'MyGroup',
        SubnetIds: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      }));

      test.done();
    },

    'can specify subnet type'(test: Test) {
      new rds.SubnetGroup(stack, 'Group', {
        description: 'MyGroup',
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      });

      expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'MyGroup',
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
        ],
      }));
      test.done();
    },
  },

  'import group by name'(test: Test) {
    const subnetGroup = rds.SubnetGroup.fromSubnetGroupName(stack, 'Group', 'my-subnet-group');

    test.equals(subnetGroup.subnetGroupName, 'my-subnet-group');

    test.done();
  },

});
