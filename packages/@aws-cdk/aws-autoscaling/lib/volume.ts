// Unfortunately a mostly-literal copy from ec2/volume.ts because this feature
// existed first in the "autoscaling" module before it existed in the "ec2"
// module so we couldn't standardize the structs in the right way.

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
   * @deprecated use `BlockDeviceVolume.noDevice()` as the volume to supress a mapping.
   *
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
   * @internal
   */
  public static _NO_DEVICE = new BlockDeviceVolume();

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
   * Supresses a volume mapping
   */
  public static noDevice() {
    return this._NO_DEVICE;
  }

  /**
   * @param ebsDevice EBS device info
   * @param virtualName Virtual device name
   */
  protected constructor(public readonly ebsDevice?: EbsDeviceProps, public readonly virtualName?: string) {
  }
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
}
