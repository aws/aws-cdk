import * as crypto from 'crypto';

import { AccountRootPrincipal, Grant, IGrantable } from '@aws-cdk/aws-iam';
import { IKey, ViaServicePrincipal } from '@aws-cdk/aws-kms';
import { Annotations, IResource, Resource, Size, SizeRoundingBehavior, Stack, Token, Tags, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnInstance, CfnVolume } from './ec2.generated';
import { IInstance } from './instance';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';


/**
 * Block device
 */
export interface BlockDevice {
  /**
   * The device name exposed to the EC2 instance
   *
   * @example '/dev/sdh', 'xvdh'
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html
   */
  readonly deviceName: string;

  /**
   * Defines the block device volume, to be either an Amazon EBS volume or an ephemeral instance store volume
   *
   * @example BlockDeviceVolume.ebs(15), BlockDeviceVolume.ephemeral(0)
   *
   */
  readonly volume: BlockDeviceVolume;

  /**
   * If false, the device mapping will be suppressed.
   * If set to false for the root device, the instance might fail the Amazon EC2 health check.
   * Amazon EC2 Auto Scaling launches a replacement instance if the instance fails the health check.
   *
   * @default true - device mapping is left untouched
   */
  readonly mappingEnabled?: boolean;
}

/**
 * Base block device options for an EBS volume
 */
export interface EbsDeviceOptionsBase {
  /**
   * Indicates whether to delete the volume when the instance is terminated.
   *
   * @default - true for Amazon EC2 Auto Scaling, false otherwise (e.g. EBS)
   */
  readonly deleteOnTermination?: boolean;

  /**
   * The number of I/O operations per second (IOPS) to provision for the volume.
   *
   * Must only be set for {@link volumeType}: {@link EbsDeviceVolumeType.IO1}
   *
   * The maximum ratio of IOPS to volume size (in GiB) is 50:1, so for 5,000 provisioned IOPS,
   * you need at least 100 GiB storage on the volume.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
   *
   * @default - none, required for {@link EbsDeviceVolumeType.IO1}
   */
  readonly iops?: number;

  /**
   * The EBS volume type
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
   *
   * @default {@link EbsDeviceVolumeType.GP2}
   */
  readonly volumeType?: EbsDeviceVolumeType;
}

/**
 * Block device options for an EBS volume
 */
export interface EbsDeviceOptions extends EbsDeviceOptionsBase {
  /**
   * Specifies whether the EBS volume is encrypted.
   * Encrypted EBS volumes can only be attached to instances that support Amazon EBS encryption
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_supported_instances
   *
   * @default false
   */
  readonly encrypted?: boolean;
}

/**
 * Block device options for an EBS volume created from a snapshot
 */
export interface EbsDeviceSnapshotOptions extends EbsDeviceOptionsBase {
  /**
   * The volume size, in Gibibytes (GiB)
   *
   * If you specify volumeSize, it must be equal or greater than the size of the snapshot.
   *
   * @default - The snapshot size
   */
  readonly volumeSize?: number;
}

/**
 * Properties of an EBS block device
 */
export interface EbsDeviceProps extends EbsDeviceSnapshotOptions {
  /**
   * The snapshot ID of the volume to use
   *
   * @default - No snapshot will be used
   */
  readonly snapshotId?: string;
}

/**
 * Describes a block device mapping for an EC2 instance or Auto Scaling group.
 */
export class BlockDeviceVolume {
  /**
   * Creates a new Elastic Block Storage device
   *
   * @param volumeSize The volume size, in Gibibytes (GiB)
   * @param options additional device options
   */
  public static ebs(volumeSize: number, options: EbsDeviceOptions = {}): BlockDeviceVolume {
    return new this({ ...options, volumeSize });
  }

  /**
   * Creates a new Elastic Block Storage device from an existing snapshot
   *
   * @param snapshotId The snapshot ID of the volume to use
   * @param options additional device options
   */
  public static ebsFromSnapshot(snapshotId: string, options: EbsDeviceSnapshotOptions = {}): BlockDeviceVolume {
    return new this({ ...options, snapshotId });
  }

  /**
   * Creates a virtual, ephemeral device.
   * The name will be in the form ephemeral{volumeIndex}.
   *
   * @param volumeIndex the volume index. Must be equal or greater than 0
   */
  public static ephemeral(volumeIndex: number) {
    if (volumeIndex < 0) {
      throw new Error(`volumeIndex must be a number starting from 0, got "${volumeIndex}"`);
    }

    return new this(undefined, `ephemeral${volumeIndex}`);
  }

  /**
   * @param ebsDevice EBS device info
   * @param virtualName Virtual device name
   */
  protected constructor(public readonly ebsDevice?: EbsDeviceProps, public readonly virtualName?: string) {
  }
}

/**
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
export function synthesizeBlockDeviceMappings(construct: Construct, blockDevices: BlockDevice[]): CfnInstance.BlockDeviceMappingProperty[] {
  return blockDevices.map<CfnInstance.BlockDeviceMappingProperty>(({ deviceName, volume, mappingEnabled }) => {
    const { virtualName, ebsDevice: ebs } = volume;

    if (ebs) {
      const { iops, volumeType } = ebs;

      if (!iops) {
        if (volumeType === EbsDeviceVolumeType.IO1) {
          throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1');
        }
      } else if (volumeType !== EbsDeviceVolumeType.IO1) {
        Annotations.of(construct).addWarning('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
      }
    }

    return {
      deviceName,
      ebs,
      virtualName,
      noDevice: mappingEnabled === false ? {} : undefined,
    };
  });
}

/**
 * Supported EBS volume types for blockDevices
 */
export enum EbsDeviceVolumeType {
  /**
   * Magnetic
   */
  STANDARD = 'standard',

  /**
   *  Provisioned IOPS SSD - IO1
   */
  IO1 = 'io1',

  /**
   *  Provisioned IOPS SSD - IO2
   */
  IO2 = 'io2',

  /**
   * General Purpose SSD - GP2
   */
  GP2 = 'gp2',

  /**
   * General Purpose SSD - GP3
   */
  GP3 = 'gp3',

  /**
   * Throughput Optimized HDD
   */
  ST1 = 'st1',

  /**
   * Cold HDD
   */
  SC1 = 'sc1',

  /**
   * General purpose SSD volume (GP2) that balances price and performance for a wide variety of workloads.
   */
  GENERAL_PURPOSE_SSD = GP2,

  /**
   * General purpose SSD volume (GP3) that balances price and performance for a wide variety of workloads.
   */
  GENERAL_PURPOSE_SSD_GP3 = GP3,

  /**
   * Highest-performance SSD volume (IO1) for mission-critical low-latency or high-throughput workloads.
   */
  PROVISIONED_IOPS_SSD = IO1,

  /**
   * Highest-performance SSD volume (IO2) for mission-critical low-latency or high-throughput workloads.
   */
  PROVISIONED_IOPS_SSD_IO2 = IO2,

  /**
   * Low-cost HDD volume designed for frequently accessed, throughput-intensive workloads.
   */
  THROUGHPUT_OPTIMIZED_HDD = ST1,

  /**
   * Lowest cost HDD volume designed for less frequently accessed workloads.
   */
  COLD_HDD = SC1,

  /**
   * Magnetic volumes are backed by magnetic drives and are suited for workloads where data is accessed infrequently, and scenarios where low-cost
   * storage for small volume sizes is important.
   */
  MAGNETIC = STANDARD,
}

/**
 * An EBS Volume in AWS EC2.
 */
export interface IVolume extends IResource {
  /**
   * The EBS Volume's ID
   *
   * @attribute
   */
  readonly volumeId: string;

  /**
   * The availability zone that the EBS Volume is contained within (ex: us-west-2a)
   */
  readonly availabilityZone: string;

  /**
   * The customer-managed encryption key that is used to encrypt the Volume.
   *
   * @attribute
   */
  readonly encryptionKey?: IKey;

  /**
   * Grants permission to attach this Volume to an instance.
   * CAUTION: Granting an instance permission to attach to itself using this method will lead to
   * an unresolvable circular reference between the instance role and the instance.
   * Use {@link IVolume.grantAttachVolumeToSelf} to grant an instance permission to attach this
   * volume to itself.
   *
   * @param grantee  the principal being granted permission.
   * @param instances the instances to which permission is being granted to attach this
   *                 volume to. If not specified, then permission is granted to attach
   *                 to all instances in this account.
   */
  grantAttachVolume(grantee: IGrantable, instances?: IInstance[]): Grant;

  /**
   * Grants permission to attach the Volume by a ResourceTag condition. If you are looking to
   * grant an Instance, AutoScalingGroup, EC2-Fleet, SpotFleet, ECS host, etc the ability to attach
   * this volume to **itself** then this is the method you want to use.
   *
   * This is implemented by adding a Tag with key `VolumeGrantAttach-<suffix>` to the given
   * constructs and this Volume, and then conditioning the Grant such that the grantee is only
   * given the ability to AttachVolume if both the Volume and the destination Instance have that
   * tag applied to them.
   *
   * @param grantee    the principal being granted permission.
   * @param constructs The list of constructs that will have the generated resource tag applied to them.
   * @param tagKeySuffix A suffix to use on the generated Tag key in place of the generated hash value.
   *                     Defaults to a hash calculated from this volume and list of constructs. (DEPRECATED)
   */
  grantAttachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant;

  /**
   * Grants permission to detach this Volume from an instance
   * CAUTION: Granting an instance permission to detach from itself using this method will lead to
   * an unresolvable circular reference between the instance role and the instance.
   * Use {@link IVolume.grantDetachVolumeFromSelf} to grant an instance permission to detach this
   * volume from itself.
   *
   * @param grantee  the principal being granted permission.
   * @param instances the instances to which permission is being granted to detach this
   *                 volume from. If not specified, then permission is granted to detach
   *                 from all instances in this account.
   */
  grantDetachVolume(grantee: IGrantable, instances?: IInstance[]): Grant;

  /**
   * Grants permission to detach the Volume by a ResourceTag condition.
   *
   * This is implemented via the same mechanism as {@link IVolume.grantAttachVolumeByResourceTag},
   * and is subject to the same conditions.
   *
   * @param grantee    the principal being granted permission.
   * @param constructs The list of constructs that will have the generated resource tag applied to them.
   * @param tagKeySuffix A suffix to use on the generated Tag key in place of the generated hash value.
   *                     Defaults to a hash calculated from this volume and list of constructs. (DEPRECATED)
   */
  grantDetachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant;
}

/**
 * Properties of an EBS Volume
 */
export interface VolumeProps {
  /**
   * The value of the physicalName property of this resource.
   *
   * @default The physical name will be allocated by CloudFormation at deployment time
   */
  readonly volumeName?: string;

  /**
   * The Availability Zone in which to create the volume.
   */
  readonly availabilityZone: string;

  /**
   * The size of the volume, in GiBs. You must specify either a snapshot ID or a volume size.
   * See {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html#ebs-volume-characteristics|Volume Characteristics}
   * for details on the allowable size for each type of volume.
   *
   * @default If you're creating the volume from a snapshot and don't specify a volume size, the default is the snapshot size.
   */
  readonly size?: Size;

  /**
   * The snapshot from which to create the volume. You must specify either a snapshot ID or a volume size.
   *
   * @default The EBS volume is not created from a snapshot.
   */
  readonly snapshotId?: string;

  /**
   * Indicates whether Amazon EBS Multi-Attach is enabled.
   * See {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html#considerations|Considerations and limitations}
   * for the constraints of multi-attach.
   *
   * @default false
   */
  readonly enableMultiAttach?: boolean;

  /**
   * Specifies whether the volume should be encrypted. The effect of setting the encryption state to true depends on the volume origin
   * (new or from a snapshot), starting encryption state, ownership, and whether encryption by default is enabled. For more information,
   * see {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default|Encryption by Default}
   * in the Amazon Elastic Compute Cloud User Guide.
   *
   * Encrypted Amazon EBS volumes must be attached to instances that support Amazon EBS encryption. For more information, see
   * {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_supported_instances|Supported Instance Types.}
   *
   * @default false
   */
  readonly encrypted?: boolean;

  /**
   * The customer-managed encryption key that is used to encrypt the Volume. The encrypted property must
   * be true if this is provided.
   *
   * Note: If using an {@link aws-kms.IKey} created from a {@link aws-kms.Key.fromKeyArn()} here,
   * then the KMS key **must** have the following in its Key policy; otherwise, the Volume
   * will fail to create.
   *
   *     {
   *       "Effect": "Allow",
   *       "Principal": { "AWS": "<arn for your account-user> ex: arn:aws:iam::00000000000:root" },
   *       "Resource": "*",
   *       "Action": [
   *         "kms:DescribeKey",
   *         "kms:GenerateDataKeyWithoutPlainText",
   *       ],
   *       "Condition": {
   *         "StringEquals": {
   *           "kms:ViaService": "ec2.<Region>.amazonaws.com", (eg: ec2.us-east-1.amazonaws.com)
   *           "kms:CallerAccount": "0000000000" (your account ID)
   *         }
   *       }
   *     }
   *
   * @default The default KMS key for the account, region, and EC2 service is used.
   */
  readonly encryptionKey?: IKey;

  /**
   * Indicates whether the volume is auto-enabled for I/O operations. By default, Amazon EBS disables I/O to the volume from attached EC2
   * instances when it determines that a volume's data is potentially inconsistent. If the consistency of the volume is not a concern, and
   * you prefer that the volume be made available immediately if it's impaired, you can configure the volume to automatically enable I/O.
   *
   * @default false
   */
  readonly autoEnableIo?: boolean;

  /**
   * The type of the volume; what type of storage to use to form the EBS Volume.
   *
   * @default {@link EbsDeviceVolumeType.GENERAL_PURPOSE_SSD}
   */
  readonly volumeType?: EbsDeviceVolumeType;

  /**
   * The number of I/O operations per second (IOPS) to provision for the volume, with a maximum ratio of 50 IOPS/GiB.
   * See {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html#EBSVolumeTypes_piops|Provisioned IOPS SSD (io1) volumes}
   * for more information.
   *
   * This parameter is valid only for PROVISIONED_IOPS_SSD volumes.
   *
   * @default None -- Required for {@link EbsDeviceVolumeType.PROVISIONED_IOPS_SSD}
   */
  readonly iops?: number;
}

/**
 * Attributes required to import an existing EBS Volume into the Stack.
 */
export interface VolumeAttributes {
  /**
   * The EBS Volume's ID
   */
  readonly volumeId: string;

  /**
   * The availability zone that the EBS Volume is contained within (ex: us-west-2a)
   */
  readonly availabilityZone: string;

  /**
   * The customer-managed encryption key that is used to encrypt the Volume.
   *
   * @default None -- The EBS Volume is not using a customer-managed KMS key for encryption.
   */
  readonly encryptionKey?: IKey;
}

/**
 * Common behavior of Volumes. Users should not use this class directly, and instead use ``Volume``.
 */
abstract class VolumeBase extends Resource implements IVolume {
  public abstract readonly volumeId: string;
  public abstract readonly availabilityZone: string;
  public abstract readonly encryptionKey?: IKey;

  public grantAttachVolume(grantee: IGrantable, instances?: IInstance[]): Grant {
    const result = Grant.addToPrincipal({
      grantee,
      actions: ['ec2:AttachVolume'],
      resourceArns: this.collectGrantResourceArns(instances),
    });

    if (this.encryptionKey) {
      // When attaching a volume, the EC2 Service will need to grant to itself permission
      // to be able to decrypt the encryption key. We restrict the CreateGrant for principle
      // of least privilege, in accordance with best practices.
      // See: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#ebs-encryption-permissions
      const kmsGrant: Grant = this.encryptionKey.grant(grantee, 'kms:CreateGrant');
      kmsGrant.principalStatement!.addConditions(
        {
          Bool: { 'kms:GrantIsForAWSResource': true },
          StringEquals: {
            'kms:ViaService': `ec2.${Stack.of(this).region}.amazonaws.com`,
            'kms:GrantConstraintType': 'EncryptionContextSubset',
          },
        },
      );
    }

    return result;
  }

  public grantAttachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant {
    const tagValue = this.calculateResourceTagValue([this, ...constructs]);
    const tagKey = `VolumeGrantAttach-${tagKeySuffix ?? tagValue.slice(0, 10).toUpperCase()}`;
    const grantCondition: { [key: string]: string } = {};
    grantCondition[`ec2:ResourceTag/${tagKey}`] = tagValue;

    const result = this.grantAttachVolume(grantee);
    result.principalStatement!.addCondition(
      'ForAnyValue:StringEquals', grantCondition,
    );

    // The ResourceTag condition requires that all resources involved in the operation have
    // the given tag, so we tag this and all constructs given.
    Tags.of(this).add(tagKey, tagValue);
    constructs.forEach(construct => Tags.of(construct as CoreConstruct).add(tagKey, tagValue));

    return result;
  }

  public grantDetachVolume(grantee: IGrantable, instances?: IInstance[]): Grant {
    const result = Grant.addToPrincipal({
      grantee,
      actions: ['ec2:DetachVolume'],
      resourceArns: this.collectGrantResourceArns(instances),
    });
    // Note: No encryption key permissions are required to detach an encrypted volume.
    return result;
  }

  public grantDetachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant {
    const tagValue = this.calculateResourceTagValue([this, ...constructs]);
    const tagKey = `VolumeGrantDetach-${tagKeySuffix ?? tagValue.slice(0, 10).toUpperCase()}`;
    const grantCondition: { [key: string]: string } = {};
    grantCondition[`ec2:ResourceTag/${tagKey}`] = tagValue;

    const result = this.grantDetachVolume(grantee);
    result.principalStatement!.addCondition(
      'ForAnyValue:StringEquals', grantCondition,
    );

    // The ResourceTag condition requires that all resources involved in the operation have
    // the given tag, so we tag this and all constructs given.
    Tags.of(this).add(tagKey, tagValue);
    constructs.forEach(construct => Tags.of(construct as CoreConstruct).add(tagKey, tagValue));

    return result;
  }

  private collectGrantResourceArns(instances?: IInstance[]): string[] {
    const stack = Stack.of(this);
    const resourceArns: string[] = [
      `arn:${stack.partition}:ec2:${stack.region}:${stack.account}:volume/${this.volumeId}`,
    ];
    const instanceArnPrefix = `arn:${stack.partition}:ec2:${stack.region}:${stack.account}:instance`;
    if (instances) {
      instances.forEach(instance => resourceArns.push(`${instanceArnPrefix}/${instance?.instanceId}`));
    } else {
      resourceArns.push(`${instanceArnPrefix}/*`);
    }
    return resourceArns;
  }

  private calculateResourceTagValue(constructs: Construct[]): string {
    const md5 = crypto.createHash('md5');
    constructs.forEach(construct => md5.update(Names.uniqueId(construct)));
    return md5.digest('hex');
  }
}

/**
 * Creates a new EBS Volume in AWS EC2.
 */
export class Volume extends VolumeBase {
  /**
   * Import an existing EBS Volume into the Stack.
   *
   * @param scope the scope of the import.
   * @param id    the ID of the imported Volume in the construct tree.
   * @param attrs the attributes of the imported Volume
   */
  public static fromVolumeAttributes(scope: Construct, id: string, attrs: VolumeAttributes): IVolume {
    class Import extends VolumeBase {
      public readonly volumeId = attrs.volumeId;
      public readonly availabilityZone = attrs.availabilityZone;
      public readonly encryptionKey = attrs.encryptionKey;
    }
    // Check that the provided volumeId looks like it could be valid.
    if (!Token.isUnresolved(attrs.volumeId) && !/^vol-[0-9a-fA-F]+$/.test(attrs.volumeId)) {
      throw new Error('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
    }
    return new Import(scope, id);
  }

  public readonly volumeId: string;
  public readonly availabilityZone: string;
  public readonly encryptionKey?: IKey;

  constructor(scope: Construct, id: string, props: VolumeProps) {
    super(scope, id, {
      physicalName: props.volumeName,
    });

    this.validateProps(props);

    const resource = new CfnVolume(this, 'Resource', {
      availabilityZone: props.availabilityZone,
      autoEnableIo: props.autoEnableIo,
      encrypted: props.encrypted,
      kmsKeyId: props.encryptionKey?.keyArn,
      iops: props.iops,
      multiAttachEnabled: props.enableMultiAttach ?? false,
      size: props.size?.toGibibytes({ rounding: SizeRoundingBehavior.FAIL }),
      snapshotId: props.snapshotId,
      volumeType: props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
    });

    this.volumeId = resource.ref;
    this.availabilityZone = props.availabilityZone;
    this.encryptionKey = props.encryptionKey;

    if (this.encryptionKey) {
      // Per: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#ebs-encryption-requirements
      const principal =
        new ViaServicePrincipal(`ec2.${Stack.of(this).region}.amazonaws.com`, new AccountRootPrincipal()).withConditions({
          StringEquals: {
            'kms:CallerAccount': Stack.of(this).account,
          },
        });
      const grant = this.encryptionKey.grant(principal,
        // Describe & Generate are required to be able to create the CMK-encrypted Volume.
        'kms:DescribeKey',
        'kms:GenerateDataKeyWithoutPlainText',
      );
      if (props.snapshotId) {
        // ReEncrypt is required for when re-encrypting from an encrypted snapshot.
        grant.principalStatement?.addActions('kms:ReEncrypt*');
      }
    }
  }

  protected validateProps(props: VolumeProps) {
    if (!(props.size || props.snapshotId)) {
      throw new Error('Must provide at least one of `size` or `snapshotId`');
    }

    if (props.snapshotId && !Token.isUnresolved(props.snapshotId) && !/^snap-[0-9a-fA-F]+$/.test(props.snapshotId)) {
      throw new Error('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
    }

    if (props.encryptionKey && !props.encrypted) {
      throw new Error('`encrypted` must be true when providing an `encryptionKey`.');
    }

    if (props.iops) {
      if (props.volumeType !== EbsDeviceVolumeType.PROVISIONED_IOPS_SSD) {
        throw new Error('`iops` may only be specified if the `volumeType` is `PROVISIONED_IOPS_SSD`/`IO1`');
      }

      if (props.iops < 100 || props.iops > 64000) {
        throw new Error('`iops` must be in the range 100 to 64,000, inclusive.');
      }

      if (props.size && (props.iops > 50 * props.size.toGibibytes({ rounding: SizeRoundingBehavior.FAIL }))) {
        throw new Error('`iops` has a maximum ratio of 50 IOPS/GiB.');
      }
    }

    if (props.enableMultiAttach && props.volumeType !== EbsDeviceVolumeType.PROVISIONED_IOPS_SSD) {
      throw new Error('multi-attach is supported exclusively on `PROVISIONED_IOPS_SSD` volumes.');
    }

    if (props.size) {
      const size = props.size.toGibibytes({ rounding: SizeRoundingBehavior.FAIL });
      // Enforce maximum volume size:
      // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html#ebs-volume-characteristics
      const sizeRanges: { [key: string]: { Min: number, Max: number } } = {};
      sizeRanges[EbsDeviceVolumeType.GENERAL_PURPOSE_SSD] = { Min: 1, Max: 16000 };
      sizeRanges[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD] = { Min: 4, Max: 16000 };
      sizeRanges[EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD] = { Min: 500, Max: 16000 };
      sizeRanges[EbsDeviceVolumeType.COLD_HDD] = { Min: 500, Max: 16000 };
      sizeRanges[EbsDeviceVolumeType.MAGNETIC] = { Min: 1, Max: 1000 };
      const volumeType = props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD;
      const { Min, Max } = sizeRanges[volumeType];
      if (size < Min || size > Max) {
        throw new Error(`\`${volumeType}\` volumes must be between ${Min} GiB and ${Max} GiB in size.`);
      }
    }
  }
}
