import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { BastionHostLinux, SubnetType, Vpc } from '../lib';

export = {
  'default instance is created in basic'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.nano',
      SubnetId: {Ref: 'VPCPrivateSubnet1Subnet8BCA10E0'}
    }));

    test.done();
  },
  'default instance is created in isolated vpc'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          subnetType: SubnetType.ISOLATED,
          name: 'Isolated',
        }
      ]
    });

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.nano',
      SubnetId: {Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6'}
    }));

    test.done();
  },
};
