import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { BastionHostLinux, BlockDeviceVolume, SubnetType, Vpc } from '../lib';

nodeunitShim({
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
      SubnetId: {Ref: 'VPCPrivateSubnet1Subnet8BCA10E0'},
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
        },
      ],
    });

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.nano',
      SubnetId: {Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6'},
    }));

    test.done();
  },
  'ebs volume is encrypted'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          subnetType: SubnetType.ISOLATED,
          name: 'Isolated',
        },
      ],
    });

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
      blockDevices: [{
        deviceName: 'EBSBastionHost',
        volume: BlockDeviceVolume.ebs(10, {
          encrypted: true,
        }),
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      BlockDeviceMappings: [
        {
          DeviceName: 'EBSBastionHost',
          Ebs: {
            Encrypted: true,
            VolumeSize: 10,
          },
        },
      ],
    }));

    test.done();
  },
});
