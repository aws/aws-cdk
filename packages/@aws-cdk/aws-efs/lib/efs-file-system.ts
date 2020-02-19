import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import {Construct, Resource, Tag} from "@aws-cdk/core";
import {CfnFileSystem, CfnMountTarget} from "./efs.generated";
import {FileSystemProps, IFileSystem} from "./file-system";

/**
 * EFS Lifecycle Policy, if a file is not accessed for given days, it will move to EFS Infrequent Access.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
 */
export enum EfsLifecyclePolicyProperty {
    /**
     * After 7 days of inaccessibility.
     */
    AFTER_7_DAYS,

    /**
     * After 14 days of inaccessibility.
     */
    AFTER_14_DAYS,

    /**
     * After 30 days of inaccessibility.
     */
    AFTER_30_DAYS,

    /**
     * After 60 days of inaccessibility.
     */
    AFTER_60_DAYS,

    /**
     * After 90 days of inaccessibility.
     */
    AFTER_90_DAYS
}

/**
 * EFS Performance mode.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
 */
export enum EfsPerformanceMode {
    /**
     * This is the general purpose performance mode for most file systems.
     */
    GENERAL_PURPOSE = "generalPurpose",

    /**
     * This performance mode can scale to higher levels of aggregate throughput and operations per second with a
     * tradeoff of slightly higher latencies.
     */
    MAX_IO = "maxIO"
}

/**
 * EFS Throughput mode.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-throughputmode
 */
export enum EfsThroughputMode {
    /**
     *  This mode on Amazon EFS scales as the size of the file system in the standard storage class grows.
     */
    BURSTING = "bursting",

    /**
     * This mode can instantly provision the throughput of the file system (in MiB/s) independent of the amount of data stored.
     */
    PROVISIONED = "provisioned"
}

/**
 * Properties of EFS FileSystem.
 */
export interface EfsFileSystemProps extends FileSystemProps {
    /**
     * Defines if the data at rest in the file system is encrypted or not.
     *
     * @default - false
     */
    readonly encrypted?: boolean;

    /**
     * The KMS key used for encryption. This is required to encrypt the data at rest if @encrypted is set to true.
     *
     * @default - if @encrypted is true, the default key for EFS (/aws/elasticfilesystem) is used
     */
    readonly kmsKey?: kms.IKey;

    /**
     * The key value pair added to the File system.
     *
     * @default - no tags will be added
     */
    readonly fileSystemTags?: Tag[];

    /**
     * A policy used by EFS lifecycle management to transition files to the Infrequent Access (IA) storage class.
     *
     * @default - none
     */
    readonly lifecyclePolicy?: EfsLifecyclePolicyProperty;

    /**
     * Enum to mention the performance mode of the file system.
     *
     * @default - GENERAL_PURPOSE
     */
    readonly performanceMode?: EfsPerformanceMode;

    /**
     * Enum to mention the throughput mode of the file system.
     *
     * @default - BURSTING
     */
    readonly throughputMode?: EfsThroughputMode;

    /**
     * Provisioned throughput for the file system. This is a required property if the throughput mode is set to PROVISIONED.
     * Valid values are 1-1024.
     *
     * @default - None, errors out
     */
    readonly provisionedThroughputInMibps?: number;
}

/**
 *  A new or imported EFS File System.
 */
abstract class EFSFileSystemBase extends Resource implements IFileSystem {

    /**
     * The security groups/rules used to allow network connections to the file system.
     */
    public abstract readonly connections: ec2.Connections;

    /**
     * @attribute
     */
    public abstract readonly fileSystemID: string;
}

/**
 * Properties that describe an existing EFS file system.
 */
export interface EfsFileSystemAttributes {
    /**
     * The security group of the file system
     */
    readonly securityGroup: ec2.ISecurityGroup;

    /**
     * The File System's ID.
     */
    readonly fileSystemID: string;
}

/**
 * The Elastic File System implementation of IFileSystem.
 * It creates a new, empty file system in Amazon Elastic File System (Amazon EFS).
 * It also creates mount target (AWS::EFS::MountTarget) implicitly to mount the
 * EFS file system on an Amazon Elastic Compute Cloud (Amazon EC2) instance or another resource.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 *
 * @resource AWS::EFS::FileSystem
 */
export class EfsFileSystem extends EFSFileSystemBase {

    /**
     * Import an existing File System from the given properties.
     */
    public static fromEfsFileSystemAttributes(scope: Construct, id: string, attrs: EfsFileSystemAttributes): IFileSystem {
        class Import extends EFSFileSystemBase implements IFileSystem {
            public readonly fileSystemID = attrs.fileSystemID;
            public readonly connections = new ec2.Connections({
                securityGroups: [attrs.securityGroup],
                defaultPort: ec2.Port.tcp(EfsFileSystem.DEFAULT_PORT)
            });
        }

        return new Import(scope, id);
    }

    /**
     * The default port File System listens on.
     */
    private static readonly DEFAULT_PORT: number = 2049;

    /**
     * The security groups/rules used to allow network connections to the file system.
     */
    public readonly connections: ec2.Connections;

    /**
     * @attribute
     */
    public readonly fileSystemID: string;

    private readonly mountTargets: CfnMountTarget[] = [];
    private readonly efsFileSystem: CfnFileSystem;

    /**
     * Constructor for creating a new EFS FileSystem.
     */
    constructor(scope: Construct, id: string, props: EfsFileSystemProps) {
        super(scope, id);

        if (props.throughputMode === EfsThroughputMode.PROVISIONED) {
            if (props.provisionedThroughputInMibps === undefined) {
                throw new Error('Property provisionedThroughputInMibps is required when throughputMode is PROVISIONED');
            } else if (!Number.isInteger(props.provisionedThroughputInMibps)) {
                throw new Error("Invalid input for provisionedThroughputInMibps");
            } else if (props.provisionedThroughputInMibps < 1 || props.provisionedThroughputInMibps > 1024) {
                this.node.addWarning("Valid values for throughput are 1-1024 MiB/s. You can get this limit increased by contacting AWS Support.");
            }
        }

        this.efsFileSystem = new CfnFileSystem(this, "FileSystem", {
            encrypted: props.encrypted,
            kmsKeyId: (props.kmsKey ? props.kmsKey.keyId : undefined),
            fileSystemTags: props.fileSystemTags,
            lifecyclePolicies: (props.lifecyclePolicy ? Array.of({
                transitionToIa: EfsLifecyclePolicyProperty[props.lifecyclePolicy]
            } as CfnFileSystem.LifecyclePolicyProperty) : undefined),
            performanceMode: props.performanceMode,
            throughputMode: props.throughputMode,
            provisionedThroughputInMibps: props.provisionedThroughputInMibps
        });

        this.fileSystemID = this.efsFileSystem.ref;
        this.node.defaultChild = this.efsFileSystem;

        const securityGroup = (props.securityGroup || new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
            vpc: props.vpc
        }));

        this.connections = new ec2.Connections({
            securityGroups: [securityGroup],
            defaultPort: ec2.Port.tcp(EfsFileSystem.DEFAULT_PORT)
        });

        const subnets = props.vpc.selectSubnets(props.vpcSubnets);

        // We now have to create the mount target for each of the mentioned subnet
        let mountTargetCount = 0;
        subnets.subnetIds.forEach((subnetId: string) => {
            const efsMountTarget = new CfnMountTarget(this,
                "EfsMountTarget" + (++mountTargetCount),
                {
                    fileSystemId: this.fileSystemID,
                    securityGroups: Array.of(securityGroup.securityGroupId),
                    subnetId
                });
            this.mountTargets.push(efsMountTarget);
        });
    }
}