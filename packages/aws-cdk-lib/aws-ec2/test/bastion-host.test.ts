import { Match, Template } from '../../assertions';
import { App, Duration, Stack } from '../../core';
import { BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT } from '../../cx-api';
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
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amikernel510hvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
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
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amikernel510hvmarm64gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
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

  test('appends new hash digest to instance logical Id if userDataCausesReplacement is true', () => {
    //GIVEN
    const stackOld = new Stack();
    const stackNew = new Stack();
    const vpcOld = new Vpc(stackOld, 'VPC');
    const vpcNew = new Vpc(stackNew, 'VPC');
    const oldSshKeys = ['foo', 'bar'];
    const newSshKeys = ['foo_new', 'bar_new'];
    const oldHash = '450c0dd0c96b2841';
    const newHash = 'a5b7d63257ea4ca9';

    // WHEN
    const bastionHostOld = new BastionHostLinux(stackOld, 'BastionHostUserDataCausesReplacement', {
      vpc: vpcOld,
      userDataCausesReplacement: true,
    });
    bastionHostOld.instance.addUserData(
      ...oldSshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );

    const bastionHostNew = new BastionHostLinux(stackNew, 'BastionHostUserDataCausesReplacement', {
      vpc: vpcNew,
      userDataCausesReplacement: true,
    });
    bastionHostNew.instance.addUserData(
      ...oldSshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );
    bastionHostNew.instance.addUserData(
      ...newSshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );

    // THEN
    Template.fromStack(stackOld).templateMatches(Match.objectLike({
      Resources: Match.objectLike({
        [`BastionHostUserDataCausesReplacement985DBC41${oldHash}`]: Match.objectLike({
          Type: 'AWS::EC2::Instance',
          Properties: Match.anyValue(),
        }),
      }),
    }));

    Template.fromStack(stackNew).templateMatches(Match.objectLike({
      Resources: Match.objectLike({
        [`BastionHostUserDataCausesReplacement985DBC41${newHash}`]: Match.objectLike({
          Type: 'AWS::EC2::Instance',
          Properties: Match.anyValue(),
        }),
      }),
    }));
  });

  test('does not append new hash digest to instance logical Id if userDataCausesReplacement is false', () => {
    //GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const sshKeys = ['foo', 'bar'];
    const hashdigest = '450c0dd0c96b2841';

    // WHEN
    const bastionHostOld = new BastionHostLinux(stack, 'BastionHostUserDataCausesReplacement', {
      vpc,
      userDataCausesReplacement: false,
    });
    bastionHostOld.instance.addUserData(
      ...sshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );

    // THEN
    Template.fromStack(stack).templateMatches(Match.objectLike({
      Resources: Match.objectLike({
        ['BastionHostUserDataCausesReplacement985DBC41']: Match.objectLike({
          Type: 'AWS::EC2::Instance',
          Properties: Match.anyValue(),
        }),
      }),
    }));
  });

  test('uses Amazon Linux 2 by default if feature flag is disabled', () => {
    // GIVEN
    const featureFlags = { [BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT]: false };
    const app = new App({
      context: featureFlags,
    });
    const stack = new Stack(app);
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amikernel510hvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });
  });

  test('uses Amazon Linux 2023 by default if feature flag is enabled', () => {
    // GIVEN
    const featureFlags = { [BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT]: true };
    const app = new App({
      context: featureFlags,
    });
    const stack = new Stack(app);
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new BastionHostLinux(stack, 'Bastion', {
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestal2023amikernel61x8664C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });
  });
});
