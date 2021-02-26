import {
  arrayWith,
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
import * as cxapi from '@aws-cdk/cx-api';
import { testFutureBehavior, testLegacyBehavior } from 'cdk-build-tools/lib/feature-flag';
import {
  AmazonLinuxGeneration,
  EbsDeviceVolumeType,
  Instance,
  InstanceType,
  MachineImage,
  Volume,
  Vpc,
} from '../lib';

describe('volume', () => {
  test('basic volume', () => {
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

    cdkExpect(stack).to(haveResource('AWS::EC2::Volume', {
      DeletionPolicy: 'Retain',
    }, ResourcePart.CompleteDefinition));
  });

  test('fromVolumeAttributes', () => {
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
    expect(volume.volumeId).toEqual(volumeId);
    expect(volume.availabilityZone).toEqual(availabilityZone);
    expect(volume.encryptionKey).toEqual(encryptionKey);

  });

  test('tagged volume', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // WHEN
    cdk.Tags.of(volume).add('TagKey', 'TagValue');

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


  });

  test('autoenableIO', () => {
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


  });

  test('encryption', () => {
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


  });

  test('encryption with kms', () => {
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


  });

  // only enable for legacy behaviour
  // see https://github.com/aws/aws-cdk/issues/12962
  testLegacyBehavior('encryption with kms from snapshot', cdk.App, (app) => {
    // GIVEN
    const stack = new cdk.Stack(app);
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


  });

  test('iops', () => {
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


  });

  test('multi-attach', () => {
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


  });

  test('snapshotId', () => {
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


  });

  test('volume: standard', () => {
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


  });

  test('volume: io1', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      iops: 300,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'io1',
    }, ResourcePart.Properties));


  });

  test('volume: io2', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
      iops: 300,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'io2',
    }, ResourcePart.Properties));


  });

  test('volume: gp2', () => {
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


  });

  test('volume: gp3', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(500),
      volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
    });

    // THEN
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      VolumeType: 'gp3',
    }, ResourcePart.Properties));


  });

  test('volume: st1', () => {
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


  });

  test('volume: sc1', () => {
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


  });

  test('grantAttachVolume to any instance', () => {
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

  });

  describe('grantAttachVolume to any instance with encryption', () => {

    // This exact assertions here are only applicable when 'aws-kms:defaultKeyPolicies' feature flag is disabled.
    // See subsequent test case for the updated behaviour
    testLegacyBehavior('legacy', cdk.App, (app) => {
      // GIVEN
      const stack = new cdk.Stack(app);
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


    });

    testFutureBehavior('with future flag aws-kms:defaultKeyPolicies', { [cxapi.KMS_DEFAULT_KEY_POLICIES]: true }, cdk.App, (app) => {
      // GIVEN
      const stack = new cdk.Stack(app);
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
      cdkExpect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: arrayWith({
            Effect: 'Allow',
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
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          }),
        },
      }));


    });

  });

  test('grantAttachVolume to any instance with KMS.fromKeyArn() encryption', () => {
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


  });

  test('grantAttachVolume to specific instances', () => {
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


  });

  test('grantAttachVolume to instance self', () => {
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
              'ec2:ResourceTag/VolumeGrantAttach-B2376B2BDA': 'b2376b2bda65cb40f83c290dd844c4aa',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantAttach-B2376B2BDA',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantAttach-B2376B2BDA',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));


  });

  test('grantAttachVolume to instance self with suffix', () => {
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
              'ec2:ResourceTag/VolumeGrantAttach-TestSuffix': 'b2376b2bda65cb40f83c290dd844c4aa',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantAttach-TestSuffix',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantAttach-TestSuffix',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));

  });

  test('grantDetachVolume to any instance', () => {
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

  });

  test('grantDetachVolume from specific instance', () => {
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


  });

  test('grantDetachVolume from instance self', () => {
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
              'ec2:ResourceTag/VolumeGrantDetach-B2376B2BDA': 'b2376b2bda65cb40f83c290dd844c4aa',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantDetach-B2376B2BDA',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantDetach-B2376B2BDA',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));


  });

  test('grantDetachVolume from instance self with suffix', () => {
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
              'ec2:ResourceTag/VolumeGrantDetach-TestSuffix': 'b2376b2bda65cb40f83c290dd844c4aa',
            },
          },
        }],
      },
    }));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Volume', {
      Tags: [
        {
          Key: 'VolumeGrantDetach-TestSuffix',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));
    cdkExpect(stack).to(haveResourceLike('AWS::EC2::Instance', {
      Tags: [
        {},
        {
          Key: 'VolumeGrantDetach-TestSuffix',
          Value: 'b2376b2bda65cb40f83c290dd844c4aa',
        },
      ],
    }, ResourcePart.Properties));

  });

  test('validation fromVolumeAttributes', () => {
    // GIVEN
    let idx: number = 0;
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'Volume', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });

    // THEN
    expect(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: volume.volumeId,
        availabilityZone: volume.availabilityZone,
      });
    }).not.toThrow();
    expect(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: 'vol-0123456789abcdefABCDEF',
        availabilityZone: 'us-east-1a',
      });
    }).not.toThrow();
    expect(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: ' vol-0123456789abcdefABCDEF', // leading invalid character(s)
        availabilityZone: 'us-east-1a',
      });
    }).toThrow('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
    expect(() => {
      Volume.fromVolumeAttributes(stack, `Volume${idx++}`, {
        volumeId: 'vol-0123456789abcdefABCDEF ', // trailing invalid character(s)
        availabilityZone: 'us-east-1a',
      });
    }).toThrow('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');

  });

  test('validation required props', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'Key');
    let idx: number = 0;

    // THEN
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
      });
    }).toThrow('Must provide at least one of `size` or `snapshotId`');
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
      });
    }).not.toThrow();
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-000000000',
      });
    }).not.toThrow();
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        snapshotId: 'snap-000000000',
      });
    }).not.toThrow();

    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encryptionKey: key,
      });
    }).toThrow('`encrypted` must be true when providing an `encryptionKey`.');
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encrypted: false,
        encryptionKey: key,
      });
    }).toThrow('`encrypted` must be true when providing an `encryptionKey`.');
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        size: cdk.Size.gibibytes(8),
        encrypted: true,
        encryptionKey: key,
      });
    }).not.toThrow();


  });

  test('validation snapshotId', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const volume = new Volume(stack, 'ForToken', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
    });
    let idx: number = 0;

    // THEN
    expect(() => {
      // Should not throw if we provide a Token for the snapshotId
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: volume.volumeId,
      });
    }).not.toThrow();
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-0123456789abcdefABCDEF',
      });
    }).not.toThrow();
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: ' snap-1234', // leading extra character(s)
      });
    }).toThrow('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
    expect(() => {
      new Volume(stack, `Volume${idx++}`, {
        availabilityZone: 'us-east-1a',
        snapshotId: 'snap-1234 ', // trailing extra character(s)
      });
    }).toThrow('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');


  });

  test('validation iops', () => {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    // Test: Type of volume
    for (const volumeType of [
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
    ]) {
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(500),
          iops: 3000,
          volumeType,
        });
      }).not.toThrow();
    }

    for (const volumeType of [
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
    ]) {
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(500),
          volumeType,
        });
      }).toThrow(/`iops` must be specified if the `volumeType` is/);
    }

    for (const volumeType of [
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
      EbsDeviceVolumeType.COLD_HDD,
      EbsDeviceVolumeType.MAGNETIC,
    ]) {
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(500),
          iops: 100,
          volumeType,
        });
      }).toThrow(/`iops` may only be specified if the `volumeType` is/);
    }

    // Test: iops in range
    for (const testData of [
      [EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 3000, 16000],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 100, 64000],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 100, 64000],
    ]) {
      const volumeType = testData[0] as EbsDeviceVolumeType;
      const min = testData[1] as number;
      const max = testData[2] as number;
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.tebibytes(10),
          volumeType,
          iops: min - 1,
        });
      }).toThrow(/iops must be between/);
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.tebibytes(10),
          volumeType,
          iops: min,
        });
      }).not.toThrow();
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.tebibytes(10),
          volumeType,
          iops: max,
        });
      }).not.toThrow();
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.tebibytes(10),
          volumeType,
          iops: max + 1,
        });
      }).toThrow(/iops must be between/);
    }

    // Test: iops ratio
    for (const testData of [
      [EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 500],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 50],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 500],
    ]) {
      const volumeType = testData[0] as EbsDeviceVolumeType;
      const max = testData[1] as number;
      const size = 10;
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(size),
          volumeType,
          iops: max * size,
        });
      }).not.toThrow();
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(size),
          volumeType,
          iops: max * size + 1,
        });
      }).toThrow(/iops has a maximum ratio of/);
    }


  });

  test('validation multi-attach', () => {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    for (const volumeType of [
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
      EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
      EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD,
      EbsDeviceVolumeType.COLD_HDD,
      EbsDeviceVolumeType.MAGNETIC,
    ]) {
      if (
        [
          EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
          EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
        ].includes(volumeType)
      ) {
        expect(() => {
          new Volume(stack, `Volume${idx++}`, {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            enableMultiAttach: true,
            volumeType,
            iops: 100,
          });
        }).not.toThrow();
      } else {
        expect(() => {
          new Volume(stack, `Volume${idx++}`, {
            availabilityZone: 'us-east-1a',
            size: cdk.Size.gibibytes(500),
            enableMultiAttach: true,
            volumeType,
          });
        }).toThrow(/multi-attach is supported exclusively/);
      }
    }


  });

  test('validation size in range', () => {
    // GIVEN
    const stack = new cdk.Stack();
    let idx: number = 0;

    // THEN
    for (const testData of [
      [EbsDeviceVolumeType.GENERAL_PURPOSE_SSD, 1, 16384],
      [EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3, 1, 16384],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD, 4, 16384],
      [EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2, 4, 16384],
      [EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD, 125, 16384],
      [EbsDeviceVolumeType.COLD_HDD, 125, 16384],
      [EbsDeviceVolumeType.MAGNETIC, 1, 1024],
    ]) {
      const volumeType = testData[0] as EbsDeviceVolumeType;
      const min = testData[1] as number;
      const max = testData[2] as number;
      const iops = [
        EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
        EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
      ].includes(volumeType) ? 100 : null;

      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(min - 1),
          volumeType,
          ...iops
            ? { iops }
            : {},
        });
      }).toThrow(/volumes must be between/);
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(min),
          volumeType,
          ...iops
            ? { iops }
            : {},
        });
      }).not.toThrow();
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(max),
          volumeType,
          ...iops
            ? { iops }
            : {},
        });
      }).not.toThrow();
      expect(() => {
        new Volume(stack, `Volume${idx++}`, {
          availabilityZone: 'us-east-1a',
          size: cdk.Size.gibibytes(max + 1),
          volumeType,
          ...iops
            ? { iops }
            : {},
        });
      }).toThrow(/volumes must be between/);
    }


  });

});
