import { expect, haveResource } from '@aws-cdk/assert';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Stack } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { AmazonLinuxImage, BlockDeviceVolume, EbsDeviceVolumeType, Instance, InstanceClass, InstanceSize, InstanceType, Vpc } from "../lib";

export = {
  'instance is created correctly'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
    }));

    test.done();
  },
  'instance is created with source/dest check switched off'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      sourceDestCheck: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      SourceDestCheck: false,
    }));

    test.done();
  },
  'instance is grantable'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const param = new StringParameter(stack, 'Param', { stringValue: 'Foobar' });
    const instance = new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    });

    // WHEN
    param.grantRead(instance);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "ssm:DescribeParameters",
              "ssm:GetParameters",
              "ssm:GetParameter",
              "ssm:GetParameterHistory"
            ],
            Effect: "Allow",
            Resource: {
              "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                    Ref: "AWS::Partition"
                  },
                  ":ssm:",
                  {
                    Ref: "AWS::Region"
                  },
                  ":",
                  {
                    Ref: "AWS::AccountId"
                  },
                  ":parameter/",
                  {
                    Ref: "Param165332EC"
                  }
                ]
              ]
            }
          }
        ],
        Version: "2012-10-17"
      },
    }));

    test.done();
  },
  "blockDeviceMappings": {
    'can set blockDeviceMappings'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

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
          })
        }, {
          deviceName: 'ebs-snapshot',
          mappingEnabled: false,
          volume: BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
            volumeSize: 500,
            deleteOnTermination: false,
            volumeType: EbsDeviceVolumeType.SC1,
          })
        }, {
          deviceName: 'ephemeral',
          volume: BlockDeviceVolume.ephemeral(0)
        }]
      });

      // THEN
      expect(stack).to(haveResource("AWS::EC2::Instance", {
        BlockDeviceMappings: [
          {
            DeviceName: "ebs",
            Ebs: {
              DeleteOnTermination: true,
              Encrypted: true,
              Iops: 5000,
              VolumeSize: 15,
              VolumeType: "io1"
            }
          },
          {
            DeviceName: "ebs-snapshot",
            Ebs: {
              DeleteOnTermination: false,
              SnapshotId: "snapshot-id",
              VolumeSize: 500,
              VolumeType: "sc1"
            },
            NoDevice: {}
          },
          {
            DeviceName: "ephemeral",
            VirtualName: "ephemeral0"
          }
        ]
      }));

      test.done();
    },

    'throws if ephemeral volumeIndex < 0'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

      // THEN
      test.throws(() => {
        new Instance(stack, 'Instance', {
          vpc,
          machineImage: new AmazonLinuxImage(),
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          blockDevices: [{
            deviceName: 'ephemeral',
            volume: BlockDeviceVolume.ephemeral(-1)
          }]
        });
      }, /volumeIndex must be a number starting from 0/);

      test.done();
    },

    'throws if volumeType === IO1 without iops'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

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
            })
          }]
        });
      }, /ops property is required with volumeType: EbsDeviceVolumeType.IO1/);

      test.done();
    },

    'warning if iops without volumeType'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

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
          })
        }]
      });

      // THEN
      test.deepEqual(instance.node.metadata[0].type, cxapi.WARNING_METADATA_KEY);
      test.deepEqual(instance.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

      test.done();
    },

    'warning if iops and volumeType !== IO1'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const vpc = new Vpc(stack, 'VPC');

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
          })
        }]
      });

      // THEN
      test.deepEqual(instance.node.metadata[0].type, cxapi.WARNING_METADATA_KEY);
      test.deepEqual(instance.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

      test.done();
    },
  },
};
