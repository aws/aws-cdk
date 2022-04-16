import { Template } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
import { BastionHostLinux, BlockDeviceVolume, CloudFormationInit, InitCommand, InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from '../lib';

describe('bastion host', () => {
  test('default instance is created in basic', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.nano',
      SubnetId: { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
    });


  });
  test('default instance is created in isolated vpc', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          subnetType: SubnetType.PRIVATE_ISOLATED,
          name: 'Isolated',
        },
      ],
    });

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.nano',
      SubnetId: { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
    });


  });
  test('ebs volume is encrypted', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC', {
      subnetConfiguration: [
        {
          subnetType: SubnetType.PRIVATE_ISOLATED,
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
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      BlockDeviceMappings: [
        {
          DeviceName: 'EBSBastionHost',
          Ebs: {
            Encrypted: true,
            VolumeSize: 10,
          },
        },
      ],
    });


  });
  test('x86-64 instances use x86-64 image by default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });


  });
  test('arm instances use arm image by default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmarm64gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });


  });

  test('add CloudFormation Init to instance', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
      initOptions: {
        timeout: Duration.minutes(30),
      },
      init: CloudFormationInit.fromElements(
        InitCommand.shellCommand('echo hello'),
      ),
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::EC2::Instance', {
      CreationPolicy: {
        ResourceSignal: {
          Timeout: 'PT30M',
        },
      },
      Metadata: {
        'AWS::CloudFormation::Init': {
          config: {
            commands: {
              '000': {
                command: 'echo hello',
              },
            },
          },
        },
      },
    });
  });

  test('imdsv2 is required', () => {
    //GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    //WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
      requireImdsv2: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    });
  });
});
