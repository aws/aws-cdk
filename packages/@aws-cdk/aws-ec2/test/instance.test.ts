import * as path from 'path';
import '@aws-cdk/assert-internal/jest';
import { arrayWith, ResourcePart, stringLike, SynthUtils } from '@aws-cdk/assert-internal';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { StringParameter } from '@aws-cdk/aws-ssm';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Stack } from '@aws-cdk/core';
import {
  AmazonLinuxImage, BlockDeviceVolume, CloudFormationInit,
  EbsDeviceVolumeType, InitCommand, Instance, InstanceArchitecture, InstanceClass, InstanceSize, InstanceType, LaunchTemplate, UserData, Vpc,
} from '../lib';


let stack: Stack;
let vpc: Vpc;
beforeEach(() => {
  stack = new Stack();
  vpc = new Vpc(stack, 'VPC');
});

describe('instance', () => {
  test('instance is created correctly', () => {
    // GIVEN
    const sampleInstances = [{
      instanceClass: InstanceClass.BURSTABLE4_GRAVITON,
      instanceSize: InstanceSize.LARGE,
      instanceType: 't4g.large',
    }, {
      instanceClass: InstanceClass.HIGH_COMPUTE_MEMORY1,
      instanceSize: InstanceSize.XLARGE3,
      instanceType: 'z1d.3xlarge',
    }];

    for (const [i, sampleInstance] of sampleInstances.entries()) {
      // WHEN
      new Instance(stack, `Instance${i}`, {
        vpc,
        machineImage: new AmazonLinuxImage(),
        instanceType: InstanceType.of(sampleInstance.instanceClass, sampleInstance.instanceSize),
      });

      // THEN
      expect(stack).toHaveResource('AWS::EC2::Instance', {
        InstanceType: sampleInstance.instanceType,
      });
    }


  });
  test('instance is created with source/dest check switched off', () => {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      sourceDestCheck: false,
    });

    // THEN
    expect(stack).toHaveResource('AWS::EC2::Instance', {
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
    expect(stack).toHaveResource('AWS::IAM::Policy', {
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
      'a1', 't4g', 'c6g', 'c6gd', 'c6gn', 'm6g', 'm6gd', 'r6g', 'r6gd', // current Graviton-based instance classes
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
    const sampleInstanceClasses = ['c5', 'm5ad', 'r5n', 'm6', 't3a', 'r6i']; // A sample of x86-64 instance classes

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
      key: 'R5D',
      value: 'r5d',
    }, {
      key: 'MEMORY5_NVME_DRIVE',
      value: 'r5d',
    }, {
      key: 'R5AD',
      value: 'r5ad',
    }, {
      key: 'MEMORY5_AMD_NVME_DRIVE',
      value: 'r5ad',
    }, {
      key: 'M5AD',
      value: 'm5ad',
    }, {
      key: 'STANDARD5_AMD_NVME_DRIVE',
      value: 'm5ad',
    }]; // A sample of instances with NVME drives

    for (const instanceClass of sampleInstanceClassKeys) {
      // WHEN
      const key = instanceClass.key as keyof(typeof InstanceClass);
      const instanceType = InstanceClass[key];

      // THEN
      expect(instanceType).toBe(instanceClass.value);
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
  describe('blockDeviceMappings', () => {
    test('can set blockDeviceMappings', () => {
      // WHEN
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
      expect(stack).toHaveResource('AWS::EC2::Instance', {
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

    test('warning if iops without volumeType', () => {
      const instance = new Instance(stack, 'Instance', {
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
      expect(instance.node.metadataEntry[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
      expect(instance.node.metadataEntry[0].data).toEqual('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');


    });

    test('warning if iops and volumeType !== IO1', () => {
      const instance = new Instance(stack, 'Instance', {
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
      expect(instance.node.metadataEntry[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
      expect(instance.node.metadataEntry[0].data).toEqual('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');


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
    expect(stack).toHaveResource('AWS::EC2::Instance', {
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
    SynthUtils.synthesize(stack);

    // THEN
    const launchTemplate = instance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
    expect(launchTemplate).toBeDefined();
    expect(stack).toHaveResourceLike('AWS::EC2::LaunchTemplate', {
      LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
      LaunchTemplateData: {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    });
    expect(stack).toHaveResourceLike('AWS::EC2::Instance', {
      LaunchTemplate: {
        LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
      },
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
  expect(stack).toHaveResource('AWS::EC2::Instance', {
    UserData: {
      'Fn::Base64': {
        'Fn::Join': ['', [
          stringLike('#!/bin/bash\n# fingerprint: *\n(\n  set +e\n  /opt/aws/bin/cfn-init -v --region '),
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
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: arrayWith({
        Action: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
        Effect: 'Allow',
        Resource: { Ref: 'AWS::StackId' },
      }),
      Version: '2012-10-17',
    },
  });
  expect(stack).toHaveResource('AWS::EC2::Instance', {
    CreationPolicy: {
      ResourceSignal: {
        Count: 1,
        Timeout: 'PT5M',
      },
    },
  }, ResourcePart.CompleteDefinition);
});

test('cause replacement from s3 asset in userdata', () => {
  // GIVEN
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
  expect(SynthUtils.toCloudFormation(stack)).toEqual(expect.objectContaining({
    Resources: expect.objectContaining({
      [`InstanceOne5B821005${hash}`]: expect.objectContaining({ Type: 'AWS::EC2::Instance', Properties: expect.anything() }),
      [`InstanceTwoDC29A7A7${hash}`]: expect.objectContaining({ Type: 'AWS::EC2::Instance', Properties: expect.anything() }),
    }),
  }));
});
