import * as path from 'path';
import { arrayWith, expect as cdkExpect, haveResource, ResourcePart, stringLike, SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { StringParameter } from '@aws-cdk/aws-ssm';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import {
  AmazonLinuxImage, BlockDeviceVolume, CloudFormationInit,
  EbsDeviceVolumeType, InitCommand, Instance, InstanceClass, InstanceSize, InstanceType, UserData, Vpc,
} from '../lib';


let stack: Stack;
let vpc: Vpc;
beforeEach(() => {
  stack = new Stack();
  vpc = new Vpc(stack, 'VPC');
});

nodeunitShim({
  'instance is created correctly'(test: Test) {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.LARGE),
    });

    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't4g.large',
    }));

    test.done();
  },
  'instance is created with source/dest check switched off'(test: Test) {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      sourceDestCheck: false,
    });

    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      SourceDestCheck: false,
    }));

    test.done();
  },
  'instance is grantable'(test: Test) {
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
    cdkExpect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  blockDeviceMappings: {
    'can set blockDeviceMappings'(test: Test) {
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
      cdkExpect(stack).to(haveResource('AWS::EC2::Instance', {
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
      }));

      test.done();
    },

    'throws if ephemeral volumeIndex < 0'(test: Test) {
      // THEN
      test.throws(() => {
        new Instance(stack, 'Instance', {
          vpc,
          machineImage: new AmazonLinuxImage(),
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          blockDevices: [{
            deviceName: 'ephemeral',
            volume: BlockDeviceVolume.ephemeral(-1),
          }],
        });
      }, /volumeIndex must be a number starting from 0/);

      test.done();
    },

    'throws if volumeType === IO1 without iops'(test: Test) {
      // THEN
      test.throws(() => {
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
      }, /ops property is required with volumeType: EbsDeviceVolumeType.IO1/);

      test.done();
    },

    'warning if iops without volumeType'(test: Test) {
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
      test.deepEqual(instance.node.metadata[0].type, cxschema.ArtifactMetadataEntryType.WARN);
      test.deepEqual(instance.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

      test.done();
    },

    'warning if iops and volumeType !== IO1'(test: Test) {
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
      test.deepEqual(instance.node.metadata[0].type, cxschema.ArtifactMetadataEntryType.WARN);
      test.deepEqual(instance.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

      test.done();
    },
  },

  'instance can be created with Private IP Address'(test: Test) {
    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      privateIpAddress: '10.0.0.2',
    });

    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      PrivateIpAddress: '10.0.0.2',
    }));

    test.done();
  },
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
  cdkExpect(stack).to(haveResource('AWS::EC2::Instance', {
    CreationPolicy: {
      ResourceSignal: {
        Count: 1,
        Timeout: 'PT5M',
      },
    },
  }, ResourcePart.CompleteDefinition));
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