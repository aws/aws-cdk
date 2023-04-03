import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { IResource, Resource, Size, RemovalPolicy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IInstance } from './instance';
/**
 * Block device
 */
export interface BlockDevice {
    /**
     * The device name exposed to the EC2 instance
     *
     * For example, a value like `/dev/sdh`, `xvdh`.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html
     */
    readonly deviceName: string;
    /**
     * Defines the block device volume, to be either an Amazon EBS volume or an ephemeral instance store volume
     *
     * For example, a value like `BlockDeviceVolume.ebs(15)`, `BlockDeviceVolume.ephemeral(0)`.
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
     * Must only be set for `volumeType`: `EbsDeviceVolumeType.IO1`
     *
     * The maximum ratio of IOPS to volume size (in GiB) is 50:1, so for 5,000 provisioned IOPS,
     * you need at least 100 GiB storage on the volume.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
     *
     * @default - none, required for `EbsDeviceVolumeType.IO1`
     */
    readonly iops?: number;
    /**
     * The EBS volume type
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
     *
     * @default `EbsDeviceVolumeType.GP2`
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
    /**
     * The ARN of the AWS Key Management Service (AWS KMS) CMK used for encryption.
     *
     * You have to ensure that the KMS CMK has the correct permissions to be used by the service launching the ec2 instances.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#ebs-encryption-requirements
     *
     * @default - If encrypted is true, the default aws/ebs KMS key will be used.
     */
    readonly kmsKey?: IKey;
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
export interface EbsDeviceProps extends EbsDeviceSnapshotOptions, EbsDeviceOptions {
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
export declare class BlockDeviceVolume {
    readonly ebsDevice?: EbsDeviceProps | undefined;
    readonly virtualName?: string | undefined;
    /**
     * Creates a new Elastic Block Storage device
     *
     * @param volumeSize The volume size, in Gibibytes (GiB)
     * @param options additional device options
     */
    static ebs(volumeSize: number, options?: EbsDeviceOptions): BlockDeviceVolume;
    /**
     * Creates a new Elastic Block Storage device from an existing snapshot
     *
     * @param snapshotId The snapshot ID of the volume to use
     * @param options additional device options
     */
    static ebsFromSnapshot(snapshotId: string, options?: EbsDeviceSnapshotOptions): BlockDeviceVolume;
    /**
     * Creates a virtual, ephemeral device.
     * The name will be in the form ephemeral{volumeIndex}.
     *
     * @param volumeIndex the volume index. Must be equal or greater than 0
     */
    static ephemeral(volumeIndex: number): BlockDeviceVolume;
    /**
     * @param ebsDevice EBS device info
     * @param virtualName Virtual device name
     */
    protected constructor(ebsDevice?: EbsDeviceProps | undefined, virtualName?: string | undefined);
}
/**
 * Supported EBS volume types for blockDevices
 */
export declare enum EbsDeviceVolumeType {
    /**
     * Magnetic
     */
    STANDARD = "standard",
    /**
     *  Provisioned IOPS SSD - IO1
     */
    IO1 = "io1",
    /**
     *  Provisioned IOPS SSD - IO2
     */
    IO2 = "io2",
    /**
     * General Purpose SSD - GP2
     */
    GP2 = "gp2",
    /**
     * General Purpose SSD - GP3
     */
    GP3 = "gp3",
    /**
     * Throughput Optimized HDD
     */
    ST1 = "st1",
    /**
     * Cold HDD
     */
    SC1 = "sc1",
    /**
     * General purpose SSD volume (GP2) that balances price and performance for a wide variety of workloads.
     */
    GENERAL_PURPOSE_SSD = "gp2",
    /**
     * General purpose SSD volume (GP3) that balances price and performance for a wide variety of workloads.
     */
    GENERAL_PURPOSE_SSD_GP3 = "gp3",
    /**
     * Highest-performance SSD volume (IO1) for mission-critical low-latency or high-throughput workloads.
     */
    PROVISIONED_IOPS_SSD = "io1",
    /**
     * Highest-performance SSD volume (IO2) for mission-critical low-latency or high-throughput workloads.
     */
    PROVISIONED_IOPS_SSD_IO2 = "io2",
    /**
     * Low-cost HDD volume designed for frequently accessed, throughput-intensive workloads.
     */
    THROUGHPUT_OPTIMIZED_HDD = "st1",
    /**
     * Lowest cost HDD volume designed for less frequently accessed workloads.
     */
    COLD_HDD = "sc1",
    /**
     * Magnetic volumes are backed by magnetic drives and are suited for workloads where data is accessed infrequently, and scenarios where low-cost
     * storage for small volume sizes is important.
     */
    MAGNETIC = "standard"
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
     * Use `IVolume.grantAttachVolumeToSelf` to grant an instance permission to attach this
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
     * Use `IVolume.grantDetachVolumeFromSelf` to grant an instance permission to detach this
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
     * This is implemented via the same mechanism as `IVolume.grantAttachVolumeByResourceTag`,
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
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volume.html
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
     * See [Considerations and limitations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html#considerations)
     * for the constraints of multi-attach.
     *
     * @default false
     */
    readonly enableMultiAttach?: boolean;
    /**
     * Specifies whether the volume should be encrypted. The effect of setting the encryption state to true depends on the volume origin
     * (new or from a snapshot), starting encryption state, ownership, and whether encryption by default is enabled. For more information,
     * see [Encryption by Default](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default)
     * in the Amazon Elastic Compute Cloud User Guide.
     *
     * Encrypted Amazon EBS volumes must be attached to instances that support Amazon EBS encryption. For more information, see
     * [Supported Instance Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_supported_instances).
     *
     * @default false
     */
    readonly encrypted?: boolean;
    /**
     * The customer-managed encryption key that is used to encrypt the Volume. The encrypted property must
     * be true if this is provided.
     *
     * Note: If using an `aws-kms.IKey` created from a `aws-kms.Key.fromKeyArn()` here,
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
     * @default `EbsDeviceVolumeType.GENERAL_PURPOSE_SSD`
     */
    readonly volumeType?: EbsDeviceVolumeType;
    /**
     * The number of I/O operations per second (IOPS) to provision for the volume. The maximum ratio is 50 IOPS/GiB for PROVISIONED_IOPS_SSD,
     * and 500 IOPS/GiB for both PROVISIONED_IOPS_SSD_IO2 and GENERAL_PURPOSE_SSD_GP3.
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volume.html
     * for more information.
     *
     * This parameter is valid only for PROVISIONED_IOPS_SSD, PROVISIONED_IOPS_SSD_IO2 and GENERAL_PURPOSE_SSD_GP3 volumes.
     *
     * @default None -- Required for io1 and io2 volumes. The default for gp3 volumes is 3,000 IOPS if omitted.
     */
    readonly iops?: number;
    /**
     * Policy to apply when the volume is removed from the stack
     *
     * @default RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * The throughput that the volume supports, in MiB/s
     * Takes a minimum of 125 and maximum of 1000.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volume.html#cfn-ec2-ebs-volume-throughput
     * @default - 125 MiB/s. Only valid on gp3 volumes.
     */
    readonly throughput?: number;
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
declare abstract class VolumeBase extends Resource implements IVolume {
    abstract readonly volumeId: string;
    abstract readonly availabilityZone: string;
    abstract readonly encryptionKey?: IKey;
    grantAttachVolume(grantee: IGrantable, instances?: IInstance[]): Grant;
    grantAttachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant;
    grantDetachVolume(grantee: IGrantable, instances?: IInstance[]): Grant;
    grantDetachVolumeByResourceTag(grantee: IGrantable, constructs: Construct[], tagKeySuffix?: string): Grant;
    private collectGrantResourceArns;
    private calculateResourceTagValue;
}
/**
 * Creates a new EBS Volume in AWS EC2.
 */
export declare class Volume extends VolumeBase {
    /**
     * Import an existing EBS Volume into the Stack.
     *
     * @param scope the scope of the import.
     * @param id    the ID of the imported Volume in the construct tree.
     * @param attrs the attributes of the imported Volume
     */
    static fromVolumeAttributes(scope: Construct, id: string, attrs: VolumeAttributes): IVolume;
    readonly volumeId: string;
    readonly availabilityZone: string;
    readonly encryptionKey?: IKey;
    constructor(scope: Construct, id: string, props: VolumeProps);
    protected validateProps(props: VolumeProps): void;
}
export {};
