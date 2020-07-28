import {
  expect as cdkExpect,
  haveResource,
  haveResourceLike,
  ResourcePart,
} from '@aws-cdk/assert';
import {
  AccountRootPrincipal,
  Role,
} from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import {
  AmazonLinuxGeneration,
  EbsDeviceVolumeType,
  Instance,
  InstanceType,
  MachineImage,
  Volume,
  Vpc,
} from '../lib';

nodeunitShim({
  'basic volume'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::Volume', {
      AvailabilityZone: 'us-east-1a',
      MultiAttachEnabled: false,
      Size: 8,
      VolumeType: 'gp2',
    }, ResourcePart.Properties));

    test.done();
  },

  'fromVolumeAttributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptionKey = new kms.Key(stack, 'Key');
    const volumeId = 'vol-000000';
    const availabilityZone = 'us-east-1a';

    // WHEN
    const volume = Volume.fromVolumeAttributes(stack, 'Volume', {
      volumeId,
      availabilityZone,
      encryptionKey,
    });

    // THEN
    test.strictEqual(volume.volumeId, volumeId);
    test.strictEqual(volume.availabilityZone, availabilityZone);
    test.strictEqual(volume.encryptionKey, encryptionKey);
    test.done();
  },

  'tagged volume'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    cdk.Tag.add(volume, 'TagKey', 'TagValue');

    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::Volume', {
      AvailabilityZone: 'us-east-1a',
      MultiAttachEnabled: false,
      Size: 8,
      VolumeType: 'gp2',
      Tags: [{
        Key: 'TagKey',
        Value: 'TagValue',
      }],
    }, ResourcePart.Properties));

    test.done();
  },

  'autoenableIO'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      autoEnableIo: true,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      AutoEnableIO: true,
    }, ResourcePart.Properties));

    test.done();
  },

  'encryption'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      encrypted: true,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Encrypted: true,
    }, ResourcePart.Properties));

    test.done();
  },

  'encryption with kms'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      encrypted: true,
      encryptionKey,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Encrypted: true,
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn',
        ],
      },
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {},
          {
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
            Action: [
              'kms:DescribeKey',
              'kms:GenerateDataKeyWithoutPlainText',
            ],
            Condition: {
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'ec2.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
                'kms:CallerAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
            },
          },
        ],
      },
    }));

    test.done();
  },

  'encryption with kms from snapshot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      encrypted: true,
      encryptionKey,
      snapshotId: 'snap-1234567890',
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {},
          {
            Action: [
              'kms:DescribeKey',
              'kms:GenerateDataKeyWithoutPlainText',
              'kms:ReEncrypt*',
            ],
          },
        ],
      },
    }));

    test.done();
  },

  'iops'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      iops: 500,
      volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Iops: 500,
      VolumeType: 'io1',
    }, ResourcePart.Properties));

    test.done();
  },

  'multi-attach'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      iops: 500,
      volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      enableMultiAttach: true,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      MultiAttachEnabled: true,
    }, ResourcePart.Properties));

    test.done();
  },

  'snapshotId'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      snapshotId: 'snap-00000000',
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      SnapshotId: 'snap-00000000',
    }, ResourcePart.Properties));

    test.done();
  },

  'volume: standard'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.MAGNETIC,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'standard',
    }, ResourcePart.Properties));

    test.done();
  },

  'volume: io1'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'io1',
    }, ResourcePart.Properties));

    test.done();
  },

  'volume: gp2'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'gp2',
    }, ResourcePart.Properties));

    test.done();
  },

  'volume: st1'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'st1',
    }, ResourcePart.Properties));

    test.done();
  },

  'volume: sc1'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.COLD_HDD,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'sc1',
    }, ResourcePart.Properties));

    test.done();
  },

  'grantAttachVolume to any instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantAttachVolume(role);

    // THEN
    cdkExpect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:AttachVolume',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':volume/',
                  {
                    Ref: 'VolumeA92988D3',
                  },
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
        }],
      },
    }));
    test.done();
  },

  'grantAttachVolume to any instance with encryption'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const encryptionKey = new kms.Key(stack, 'Key');
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
      encrypted: true,
      encryptionKey,
    });

    // WHEN
    volume.grantAttachVolume(role);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {},
          {},
          {
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::GetAtt': [
                  'Role1ABCC5F0',
                  'Arn',
                ],
              },
            },
            Action: 'kms:CreateGrant',
            Condition: {
              Bool: {
                'kms:GrantIsForAWSResource': true,
              },
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'ec2.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
                'kms:GrantConstraintType': 'EncryptionContextSubset',
              },
            },
            Resource: '*',
          },
        ],
      },
    }));

    test.done();
  },

  'grantAttachVolume to any instance with KMS.fromKeyArn() encryption'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const kmsKey = new kms.Key(stack, 'Key');
    // kmsKey policy is not strictly necessary for the test.
    // Demonstrating how to properly construct the Key.
    const principal =
      new kms.ViaServicePrincipal(`ec2.${stack.region}.amazonaws.com`, new AccountRootPrincipal()).withConditions({
        StringEquals: {
          'kms:CallerAccount': stack.account,
        },
      });
    kmsKey.grant(principal,
      // Describe & Generate are required to be able to create the CMK-encrypted Volume.
      'kms:DescribeKey',
      'kms:GenerateDataKeyWithoutPlainText',
      // ReEncrypt is required for when the CMK is rotated.
      'kms:ReEncrypt*',
    );

    const encryptionKey = kms.Key.fromKeyArn(stack, 'KeyArn', kmsKey.keyArn);
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
      encrypted: true,
      encryptionKey,
    });

    // WHEN
    volume.grantAttachVolume(role);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {},
          {
            Effect: 'Allow',
            Action: 'kms:CreateGrant',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
            Condition: {
              Bool: {
                'kms:GrantIsForAWSResource': true,
              },
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'ec2.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
                'kms:GrantConstraintType': 'EncryptionContextSubset',
              },
            },
          },
        ],
      },
    }));

    test.done();
  },

  'grantAttachVolume to specific instances'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const vpc = new Vpc(stack, 'Vpc');
    const instance1 = new Instance(stack, 'Instance1', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const instance2 = new Instance(stack, 'Instance2', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantAttachVolume(role, [instance1, instance2]);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:AttachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/',
                  {
                    Ref: 'Instance14BC3991D',
                  },
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/',
                  {
                    Ref: 'Instance255F35265',
                  },
                ],
              ],
            },
          ],
        }],
      },
    }));

    test.done();
  },

  'grantAttachVolume to instance self'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc');
    const instance = new Instance(stack, 'Instance', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance]);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:AttachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
          Condition: {
            'ForAnyValue:StringEquals': {
              'ec2:ResourceTag/VolumeGrantAttach-BD7A9717': 'd9a17c1c9e8ef6866e4dbeef41c741b2',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantAttach-BD7A9717',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantAttach-BD7A9717',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));

    test.done();
  },

  'grantAttachVolume to instance self with suffix'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc');
    const instance = new Instance(stack, 'Instance', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance], 'TestSuffix');

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:AttachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
          Condition: {
            'ForAnyValue:StringEquals': {
              'ec2:ResourceTag/VolumeGrantAttach-TestSuffix': 'd9a17c1c9e8ef6866e4dbeef41c741b2',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantAttach-TestSuffix',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantAttach-TestSuffix',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));

    test.done();
  },

  'grantDetachVolume to any instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantDetachVolume(role);

    // THEN
    cdkExpect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:DetachVolume',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':volume/',
                  {
                    Ref: 'VolumeA92988D3',
                  },
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
        }],
      },
    }));
    test.done();
  },

  'grantDetachVolume from specific instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
    const vpc = new Vpc(stack, 'Vpc');
    const instance1 = new Instance(stack, 'Instance1', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const instance2 = new Instance(stack, 'Instance2', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantDetachVolume(role, [instance1, instance2]);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:DetachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/',
                  {
                    Ref: 'Instance14BC3991D',
                  },
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/',
                  {
                    Ref: 'Instance255F35265',
                  },
                ],
              ],
            },
          ],
        }],
      },
    }));

    test.done();
  },

  'grantDetachVolume from instance self'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc');
    const instance = new Instance(stack, 'Instance', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantDetachVolumeByResourceTag(instance.grantPrincipal, [instance]);

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:DetachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
          Condition: {
            'ForAnyValue:StringEquals': {
              'ec2:ResourceTag/VolumeGrantDetach-BD7A9717': 'd9a17c1c9e8ef6866e4dbeef41c741b2',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantDetach-BD7A9717',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantDetach-BD7A9717',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));

    test.done();
  },

  'grantDetachVolume from instance self with suffix'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc');
    const instance = new Instance(stack, 'Instance', {
      vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      availabilityZone: 'us-east-1a',
    });
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    volume.grantDetachVolumeByResourceTag(instance.grantPrincipal, [instance], 'TestSuffix');

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'ec2:DetachVolume',
          Effect: 'Allow',
          Resource: [
            {},
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          ],
          Condition: {
            'ForAnyValue:StringEquals': {
              'ec2:ResourceTag/VolumeGrantDetach-TestSuffix': 'd9a17c1c9e8ef6866e4dbeef41c741b2',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantDetach-TestSuffix',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantDetach-TestSuffix',
          Value: 'd9a17c1c9e8ef6866e4dbeef41c741b2',
        },
      ],
    }, ResourcePart.Properties));

    test.done();
  },

  'validation fromVolumeAttributes'(test: Test) {
    // GIVEN
    let idx: number = 0;
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // THEN
    test.doesNotThrow(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: volume.volumeId,
        availabilityZone: volume.availabilityZone,
      });
    });
    test.doesNotThrow(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: 'vol-0123456789abcdefABCDEF',
        availabilityZone: 'us-east-1a',
      });
    });
    test.throws(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: ' vol-0123456789abcdefABCDEF', // leading invalid character(s)
        availabilityZone: 'us-east-1a',
      });
    }, '`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
    test.throws(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: 'vol-0123456789abcdefABCDEF ', // trailing invalid character(s)
        availabilityZone: 'us-east-1a',
      });
    }, '`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
    test.done();
  },

  'validation required props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'Key');
    let idx: number = 0;

    // THEN
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
      });
    }, 'Must provide at least one of `size` or `snapshotId`');
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
      });
    });
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-000000000',
      });
    });
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        snapshotId: 'snap-000000000',
      });
    });

    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encryptionKey: key,
      });
    }, '`encrypted` must be true when providing an `encryptionKey`.');
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encrypted: false,
        encryptionKey: key,
      });
    }, '`encrypted` must be true when providing an `encryptionKey`.');
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encrypted: true,
        encryptionKey: key,
      });
    });

    test.done();
  },

  'validation snapshotId'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'ForToken', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });
    let idx: number = 0;

    // THEN
    test.doesNotThrow(() => {
      // Should not throw if we provide a Token for the snapshotId
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: volume.volumeId,
      });
    });
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-0123456789abcdefABCDEF',
      });
    });
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: ' snap-1234', // leading extra character(s)
      });
    }, '`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-1234 ', // trailing extra character(s)
      });
    }, '`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');

    test.done();
  },

  'validation iops'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    // Test: Type of volume
    for (const volumeType of [
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
      EbsDeviceVolumeType.COLD_HDD,
      EbsDeviceVolumeType.MAGNETIC,
    ]) {
      test.throws(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(500),
          iops: 100,
          volumeType,
        });
      }, '`iops` may only be specified if the `volumeType` is `PROVISIONED_IOPS_SSD`/`IO1`');
    }

    // Test: iops in range
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(10),
        iops: 99,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    }, '`iops` must be in the range 100 to 64,000, inclusive.');
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(10),
        iops: 100,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    });
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(1300),
        iops: 64000,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    });
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(1300),
        iops: 64001,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    }, '`iops` must be in the range 100 to 64,000, inclusive.');

    // Test: iops ratio
    test.doesNotThrow(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(10),
        iops: 500,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    });
    test.throws(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(10),
        iops: 501,
        volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      });
    }, '`iops` has a maximum ratio of 50 IOPS/GiB.');

    test.done();
  },

  'validation multi-attach'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    for (const volumeType of [
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
      EbsDeviceVolumeType.COLD_HDD,
      EbsDeviceVolumeType.MAGNETIC,
    ]) {
      test.throws(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(500),
          enableMultiAttach: true,
          volumeType,
        });
      }, 'multi-attach is supported exclusively on `PROVISIONED_IOPS_SSD` volumes.');
    }

    test.done();
  },

  'validation size in range'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    for (const testData of [
      [EbsDeviceVolumeType.GENERAL_PURPOSE_SSD, 1, 16000],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 4, 16000],
      [EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD, 500, 16000],
      [EbsDeviceVolumeType.COLD_HDD, 500, 16000],
      [EbsDeviceVolumeType.MAGNETIC, 1, 1000],
    ]) {
      const volumeType = testData[0] as EbsDeviceVolumeType;
      const min = testData[1] as number;
      const max = testData[2] as number;
      test.throws(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(min - 1),
          volumeType,
        });
      }, `\`${volumeType}\` volumes must be between ${min} GiB and ${max} GiB in size.`);
      test.doesNotThrow(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(min),
          volumeType,
        });
      });
      test.doesNotThrow(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(max),
          volumeType,
        });
      });
      test.throws(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(max + 1),
          volumeType,
        });
      }, `\`${volumeType}\` volumes must be between ${min} GiB and ${max} GiB in size.`);
    }

    test.done();
  },

});
