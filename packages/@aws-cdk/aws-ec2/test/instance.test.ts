import * as path from 'path';
import { Annotations, Match, Template } from '@aws-cdk/assertions';
import { Key } from '@aws-cdk/aws-kms';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { App, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import {
  AmazonLinuxImage,
  BlockDeviceVolume,
  CloudFormationInit,
  EbsDeviceVolumeType,
  InitCommand,
  Instance,
  InstanceArchitecture,
  InstanceClass,
  InstanceSize,
  InstanceType,
  LaunchTemplate,
  UserData,
  Vpc,
} from '../lib';

let stack: Stack;
let vpc: Vpc;
beforeEach(() => {
  stack = new Stack();
  vpc = new Vpc(stack, 'VPC');
});

describe('instance', () => {
  test('instance is created with source/dest check switched off', () => {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      sourceDestCheck: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      SourceDestCheck: false,
    });


  });
  test('instance is grantable', () => {
    // GIVEN
    const param = new StringParameter(stack, 'Param', { stringValue: 'Foobar' });
    const instance = new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    });

    // WHEN
    param.grantRead(instance);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/',
                  {
                    Ref: 'Param165332EC',
                  },
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });


  });
  test('instance architecture is correctly discerned for arm instances', () => {
    // GIVEN
    const sampleInstanceClasses = [
      'a1', 't4g', 'c6g', 'c7g', 'c6gd', 'c6gn', 'm6g', 'm6gd', 'r6g', 'r6gd', 'g5g', 'im4gn', 'is4gen', // current Graviton-based instance classes
      'a13', 't11g', 'y10ng', 'z11ngd', // theoretical future Graviton-based instance classes
    ];

    for (const instanceClass of sampleInstanceClasses) {
      // WHEN
      const instanceType = InstanceType.of(instanceClass as InstanceClass, InstanceSize.XLARGE18);

      // THEN
      expect(instanceType.architecture).toBe(InstanceArchitecture.ARM_64);
    }


  });
  test('instance architecture is correctly discerned for x86-64 instance', () => {
    // GIVEN
    const sampleInstanceClasses = ['c5', 'm5ad', 'r5n', 'm6', 't3a', 'r6i', 'r6a', 'p4de']; // A sample of x86-64 instance classes

    for (const instanceClass of sampleInstanceClasses) {
      // WHEN
      const instanceType = InstanceType.of(instanceClass as InstanceClass, InstanceSize.XLARGE18);

      // THEN
      expect(instanceType.architecture).toBe(InstanceArchitecture.X86_64);
    }


  });

  test('instances with local NVME drive are correctly named', () => {
    // GIVEN
    const sampleInstanceClassKeys = [{
      key: InstanceClass.R5D,
      value: 'r5d',
    }, {
      key: InstanceClass.MEMORY5_NVME_DRIVE,
      value: 'r5d',
    }, {
      key: InstanceClass.R5AD,
      value: 'r5ad',
    }, {
      key: InstanceClass.MEMORY5_AMD_NVME_DRIVE,
      value: 'r5ad',
    }, {
      key: InstanceClass.M5AD,
      value: 'm5ad',
    }, {
      key: InstanceClass.STANDARD5_AMD_NVME_DRIVE,
      value: 'm5ad',
    }]; // A sample of instances with NVME drives

    for (const instanceClass of sampleInstanceClassKeys) {
      // WHEN
      const instanceType = InstanceType.of(instanceClass.key, InstanceSize.LARGE);
      // THEN
      expect(instanceType.toString().split('.')[0]).toBe(instanceClass.value);
    }
  });
  test('instance architecture throws an error when instance type is invalid', () => {
    // GIVEN
    const malformedInstanceTypes = ['t4', 't4g.nano.', 't4gnano', ''];

    for (const malformedInstanceType of malformedInstanceTypes) {
      // WHEN
      const instanceType = new InstanceType(malformedInstanceType);

      // THEN
      expect(() => instanceType.architecture).toThrow('Malformed instance type identifier');
    }


  });
  test('can propagate EBS volume tags', () => {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      propagateTagsToVolumeOnCreation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      PropagateTagsToVolumeOnCreation: true,
    });
  });
  describe('blockDeviceMappings', () => {
    test('can set blockDeviceMappings', () => {
      // WHEN
      const kmsKey = new Key(stack, 'EbsKey');
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        blockDevices: [{
          deviceName: 'ebs',
          mappingEnabled: true,
          volume: BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            volumeType: EbsDeviceVolumeType.IO1,
            iops: 5000,
          }),
        }, {
          deviceName: 'ebs-gp3',
          mappingEnabled: true,
          volume: BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            volumeType: EbsDeviceVolumeType.GP3,
            iops: 5000,
          }),
        }, {
          deviceName: 'ebs-cmk',
          mappingEnabled: true,
          volume: BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            kmsKey: kmsKey,
            volumeType: EbsDeviceVolumeType.IO1,
            iops: 5000,
          }),
        }, {
          deviceName: 'ebs-snapshot',
          mappingEnabled: false,
          volume: BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
            volumeSize: 500,
            deleteOnTermination: false,
            volumeType: EbsDeviceVolumeType.SC1,
          }),
        }, {
          deviceName: 'ephemeral',
          volume: BlockDeviceVolume.ephemeral(0),
        }],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        BlockDeviceMappings: [
          {
            DeviceName: 'ebs',
            Ebs: {
              DeleteOnTermination: true,
              Encrypted: true,
              Iops: 5000,
              VolumeSize: 15,
              VolumeType: 'io1',
            },
          },
          {
            DeviceName: 'ebs-gp3',
            Ebs: {
              DeleteOnTermination: true,
              Encrypted: true,
              Iops: 5000,
              VolumeSize: 15,
              VolumeType: 'gp3',
            },
          },
          {
            DeviceName: 'ebs-cmk',
            Ebs: {
              DeleteOnTermination: true,
              Encrypted: true,
              KmsKeyId: {
                'Fn::GetAtt': [
                  'EbsKeyD3FEE551',
                  'Arn',
                ],
              },
              Iops: 5000,
              VolumeSize: 15,
              VolumeType: 'io1',
            },
          },
          {
            DeviceName: 'ebs-snapshot',
            Ebs: {
              DeleteOnTermination: false,
              SnapshotId: 'snapshot-id',
              VolumeSize: 500,
              VolumeType: 'sc1',
            },
            NoDevice: {},
          },
          {
            DeviceName: 'ephemeral',
            VirtualName: 'ephemeral0',
          },
        ],
      });


    });

    test('throws if ephemeral volumeIndex < 0', () => {
      // THEN
      expect(() => {
        new Instance(stack, 'Instance', {
          vpc,
          machineImage: new AmazonLinuxImage(),
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          blockDevices: [{
            deviceName: 'ephemeral',
            volume: BlockDeviceVolume.ephemeral(-1),
          }],
        });
      }).toThrow(/volumeIndex must be a number starting from 0/);


    });

    test('throws if volumeType === IO1 without iops', () => {
      // THEN
      expect(() => {
        new Instance(stack, 'Instance', {
          vpc,
          machineImage: new AmazonLinuxImage(),
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          blockDevices: [{
            deviceName: 'ebs',
            volume: BlockDeviceVolume.ebs(15, {
              deleteOnTermination: true,
              encrypted: true,
              volumeType: EbsDeviceVolumeType.IO1,
            }),
          }],
        });
      }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1/);
    });

    test('throws if volumeType === IO2 without iops', () => {
      // THEN
      expect(() => {
        new Instance(stack, 'Instance', {
          vpc,
          machineImage: new AmazonLinuxImage(),
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          blockDevices: [{
            deviceName: 'ebs',
            volume: BlockDeviceVolume.ebs(15, {
              deleteOnTermination: true,
              encrypted: true,
              volumeType: EbsDeviceVolumeType.IO2,
            }),
          }],
        });
      }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1 and EbsDeviceVolumeType.IO2/);
    });

    test('warning if iops without volumeType', () => {
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        blockDevices: [{
          deviceName: 'ebs',
          volume: BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            iops: 5000,
          }),
        }],
      });

      // THEN
      Annotations.fromStack(stack).hasWarning('/Default/Instance', 'iops will be ignored without volumeType: IO1, IO2, or GP3');
    });

    test('warning if iops and invalid volumeType', () => {
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        blockDevices: [{
          deviceName: 'ebs',
          volume: BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            volumeType: EbsDeviceVolumeType.GP2,
            iops: 5000,
          }),
        }],
      });

      // THEN
      Annotations.fromStack(stack).hasWarning('/Default/Instance', 'iops will be ignored without volumeType: IO1, IO2, or GP3');
    });
  });

  test('instance can be created with Private IP Address', () => {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      privateIpAddress: '10.0.0.2',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      PrivateIpAddress: '10.0.0.2',
    });


  });

  test('instance requires IMDSv2', () => {
    // WHEN
    const instance = new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: new InstanceType('t2.micro'),
      requireImdsv2: true,
    });

    // Force stack synth so the InstanceRequireImdsv2Aspect is applied
    Template.fromStack(stack);

    // THEN
    const launchTemplate = instance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
    expect(launchTemplate).toBeDefined();
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
      LaunchTemplateData: {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      LaunchTemplate: {
        LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
      },
    });
  });

  describe('Detailed Monitoring', () => {
    test('instance with Detailed Monitoring enabled', () => {
      // WHEN
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: new InstanceType('t2.micro'),
        detailedMonitoring: true,
      });

      // Force stack synth so the Instance is applied
      Template.fromStack(stack);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        Monitoring: true,
      });
    });

    test('instance with Detailed Monitoring disabled', () => {
      // WHEN
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: new InstanceType('t2.micro'),
        detailedMonitoring: false,
      });

      // Force stack synth so the Instance is applied
      Template.fromStack(stack);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        Monitoring: false,
      });
    });

    test('instance with Detailed Monitoring unset falls back to disabled', () => {
      // WHEN
      new Instance(stack, 'Instance', {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: new InstanceType('t2.micro'),
      });

      // Force stack synth so the Instance is applied
      Template.fromStack(stack);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        Monitoring: Match.absent(),
      });
    });
  });

});

test('add CloudFormation Init to instance', () => {
  // GIVEN
  new Instance(stack, 'Instance', {
    vpc,
    machineImage: new AmazonLinuxImage(),
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    init: CloudFormationInit.fromElements(
      InitCommand.shellCommand('echo hello'),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
    UserData: {
      'Fn::Base64': {
        'Fn::Join': ['', [
          '#!/bin/bash\n# fingerprint: 85ac432b1de1144f\n(\n  set +e\n  /opt/aws/bin/cfn-init -v --region ',
          { Ref: 'AWS::Region' },
          ' --stack ',
          { Ref: 'AWS::StackName' },
          ' --resource InstanceC1063A87 -c default\n  /opt/aws/bin/cfn-signal -e $? --region ',
          { Ref: 'AWS::Region' },
          ' --stack ',
          { Ref: 'AWS::StackName' },
          ' --resource InstanceC1063A87\n  cat /var/log/cfn-init.log >&2\n)',
        ]],
      },
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([{
        Action: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
        Effect: 'Allow',
        Resource: { Ref: 'AWS::StackId' },
      }]),
      Version: '2012-10-17',
    },
  });
  Template.fromStack(stack).hasResource('AWS::EC2::Instance', {
    CreationPolicy: {
      ResourceSignal: {
        Count: 1,
        Timeout: 'PT5M',
      },
    },
  });
});

test('cause replacement from s3 asset in userdata', () => {
  // GIVEN
  const app = new App({
    context: {
      [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
    },
  });
  stack = new Stack(app);
  vpc = new Vpc(stack, 'Vpc)');
  const userData1 = UserData.forLinux();
  const asset1 = new Asset(stack, 'UserDataAssets1', {
    path: path.join(__dirname, 'asset-fixture', 'data.txt'),
  });
  userData1.addS3DownloadCommand({ bucket: asset1.bucket, bucketKey: asset1.s3ObjectKey });

  const userData2 = UserData.forLinux();
  const asset2 = new Asset(stack, 'UserDataAssets2', {
    path: path.join(__dirname, 'asset-fixture', 'data.txt'),
  });
  userData2.addS3DownloadCommand({ bucket: asset2.bucket, bucketKey: asset2.s3ObjectKey });

  // WHEN
  new Instance(stack, 'InstanceOne', {
    vpc,
    machineImage: new AmazonLinuxImage(),
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    userData: userData1,
    userDataCausesReplacement: true,
  });
  new Instance(stack, 'InstanceTwo', {
    vpc,
    machineImage: new AmazonLinuxImage(),
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    userData: userData2,
    userDataCausesReplacement: true,
  });

  // THEN -- both instances have the same userData hash, telling us the hash is based
  // on the actual asset hash and not accidentally on the token stringification of them.
  // (which would base the hash on '${Token[1234.bla]}'
  const hash = 'f88eace39faf39d7';
  Template.fromStack(stack).templateMatches(Match.objectLike({
    Resources: Match.objectLike({
      [`InstanceOne5B821005${hash}`]: Match.objectLike({
        Type: 'AWS::EC2::Instance',
        Properties: Match.anyValue(),
      }),
      [`InstanceTwoDC29A7A7${hash}`]: Match.objectLike({
        Type: 'AWS::EC2::Instance',
        Properties: Match.anyValue(),
      }),
    }),
  }));
});

test('ssm permissions adds right managed policy', () => {
  // WHEN
  new Instance(stack, 'InstanceOne', {
    vpc,
    machineImage: new AmazonLinuxImage(),
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    ssmSessionPermissions: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':iam::aws:policy/AmazonSSMManagedInstanceCore',
        ]],
      },
    ],
  });
});

