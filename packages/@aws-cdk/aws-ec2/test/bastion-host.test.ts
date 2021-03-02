import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { BastionHostLinux, BlockDeviceVolume, InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from '../lib';

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
      SubnetId: { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
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
      SubnetId: { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
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
  'x86-64 instances use x86-64 image by default'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    }));

    test.done();
  },
  'arm instances use arm image by default'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmarm64gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    }));

    test.done();
  },
});
