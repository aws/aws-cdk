import { Construct } from 'constructs';
import { DailyAutomaticBackupStartTime } from './daily-automatic-backup-start-time';
import { FileSystemAttributes, FileSystemBase, FileSystemProps, IFileSystem } from './file-system';
import { CfnFileSystem } from './fsx.generated';
import { MaintenanceTime } from './maintenance-time';
import * as ec2 from '../../aws-ec2';
import { Aws, Duration } from '../../core';

/**
 * The different kinds of file system deployments used by NetApp ONTAP.
 */
export enum OntapDeploymentType {
  /**
   * A high availability file system configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability.
   * This is a first-generation FSx for ONTAP file system.
   */
  MULTI_AZ_1 = 'MULTI_AZ_1',

  /**
   * A high availability file system configured for Multi-AZ redundancy to tolerate temporary AZ unavailability.
   * This is a second-generation FSx for ONTAP file system.
   */
  MULTI_AZ_2 = 'MULTI_AZ_2',

  /**
   * A file system configured for Single-AZ redundancy.
   * This is a first-generation FSx for ONTAP file system.
   */
  SINGLE_AZ_1 = 'SINGLE_AZ_1',

  /**
   * A file system configured with multiple high-availability (HA) pairs for Single-AZ redundancy.
   * This is a second-generation FSx for ONTAP file system.
   */
  SINGLE_AZ_2 = 'SINGLE_AZ_2',
}

/**
 * The configuration for the Amazon FSx for NeetApp ONTAP file system.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html
 */
export interface OntapConfiguration {
  /**
   * The number of days to retain automatic backups.
   * Setting this property to 0 disables automatic backups.
   * You can retain automatic backups for a maximum of 90 days.
   *
   * @default - disable automatic backups
   */
  readonly automaticBackupRetention?: Duration;

  /**
    * Start time for 30-minute daily automatic backup window in Coordinated Universal Time (UTC).
    *
    * @default - no backup window
    */
  readonly dailyAutomaticBackupStartTime?: DailyAutomaticBackupStartTime;

  /**
    * The FSx for ONTAP file system deployment type to use in creating the file system.
    */
  readonly deploymentType: OntapDeploymentType;

  /**
    * The total number of SSD IOPS provisioned for the file system.
    *
    * The minimum and maximum values for this property depend on the value of HAPairs and StorageCapacity.
    * The minimum value is calculated as StorageCapacity * 3 * HAPairs (3 IOPS per GB of StorageCapacity). The maximum value is calculated as 200,000 * HAPairs.
    *
    * Amazon FSx responds with an HTTP status code 400 (Bad Request) if the value of Iops is outside of the minimum or maximum values.
    *
    * @default - 3 IOPS per GB of storage capacity
    */
  readonly diskIops?: number;

  /**
    * The IP address range in which the endpoints to access your file system will be created.
    *
    * You can have overlapping endpoint IP addresses for file systems deployed in the same VPC/route tables, as long as they don't overlap with any subnet.
    *
    * @default -
    */
  readonly endpointIpAddressRange?: string;

  /**
    * The ONTAP administrative password for the fsxadmin user with which you administer your file system using the NetApp ONTAP CLI and REST API.
    */
  readonly fsxAdminPassword?: string;

  /**
    * How many high-availability (HA) pairs of file servers will power your file system.
    * First-generation file systems are powered by 1 HA pair.
    * Second-generation multi-AZ file systems are powered by 1 HA pair.
    * Second generation single-AZ file systems are powered by up to 12 HA pairs.
    *
    * The value of this property affects the values of StorageCapacity, Iops, and ThroughputCapacity.
    *
    * Block storage protocol support (iSCSI and NVMe over TCP) is disabled on file systems with more than 6 HA pairs.
    *
    * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/administering-file-systems.html#HA-pairs
    * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/supported-fsx-clients.html#using-block-storage
    *
    * @default - 1 HA pair
    */
  readonly haPairs?: number;

  /**
    * The subnet in which you want the preferred file server to be located.
    *
    * This value is required when DeploymentType is set to MULTI_AZ_1 or MULTI_AZ_2.
    *
    * @default
    */
  readonly prefferredSubnet?: ec2.ISubnet;

  /**
    * The route tables in which Amazon FSx creates the rules for routing traffic to the correct file server.
    * You should specify all virtual private cloud (VPC) route tables associated with the subnets in which your clients are located.
    *
    * Amazon FSx manages VPC route tables for Multi-AZ file systems using tag-based authentication.
    * These route tables are tagged with Key: AmazonFSx; Value: ManagedByAmazonFSx.
    *
    * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/unable-to-access.html#vpc-route-tables-not-tagged
    *
    * @default - Amazon FSx selects your VPC's default route table.
    */
  readonly routeTables?: ec2.IRouteTable[];

  /**
    * The throughput capacity for the file system that you're creating in megabytes per second (MBps).
    *
    * You can define either the `throughputCapacityPerHaPair` or the `throughputCapacity` when creating a file system, but not both.
    *
    * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-throughput-capacity.html
    *
    * @default - recommended throughput capacity based on the storage capacity
    */
  readonly throughputCapacity?: number;

  /**
    * The throughput capacity per HA pair, rather than the total throughput for the file system.
    *
    * You can define either the `throughputCapacityPerHaPair` or the `throughputCapacity` when creating a file system, but not both.
    *
    * For SINGLE_AZ_1 and MULTI_AZ_1 file systems, valid values are 128, 256, 512, 1024, 2048, or 4096 MBps.
    * For SINGLE_AZ_2, valid values are 1536, 3072, or 6144 MBps.
    * For MULTI_AZ_2, valid values are 384, 768, 1536, 3072, or 6144 MBps.
    *
    * @default - recommended throughput capacity based on the storage capacity
    */
  readonly throughputCapacityPerHaPair?: number;

  /**
    * The preferred day and time to perform weekly maintenance. The first digit is the day of the week, starting at 1
    * for Monday, then the following are hours and minutes in the UTC time zone, 24 hour clock. For example: '2:20:30'
    * is Tuesdays at 20:30.
    *
    * @default - no preference
    */
  readonly weeklyMaintenanceStartTime?: MaintenanceTime;
}

/**
 * Properties specific to the NetApp ONTAP version of the FSx file system.
 */
export interface OntapFileSystemProps extends FileSystemProps {
  /**
   * Additional configuration for FSx specific to NetApp ONTAP.
   */
  ontapConfiguration: OntapConfiguration;

  /**
    * The subnet that the file system will be accessible from.
    *
    * For MULTI_AZ_1 deployment types,
    * this subnet is for the standby file server and you have to specify a `prefferredSubnet` for the preffered file server.
    */
  readonly vpcSubnet: ec2.ISubnet;
}

/**
 * The FSx for NetApp ONTAP File System implementation of IFileSystem.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 *
 * @resource AWS::FSx::FileSystem
 */
export class OntapFileSystem extends FileSystemBase {

  /**
   * Import an existing FSx for NetApp ONTAP file system from the given properties.
   */
  public static fromOntapFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    class Import extends FileSystemBase {
      public readonly dnsName = attrs.dnsName;
      public readonly fileSystemId = attrs.fileSystemId;
      public readonly connections = OntapFileSystem.configureConnections(attrs.securityGroup);
    }

    return new Import(scope, id);
  }

  /**
   * The default FSx file system type used by FSx for NetApp ONTAP.
   */
  private static readonly DEFAULT_FILE_SYSTEM_TYPE: string = 'ONTAP';

  /**
   * Configures a Connections object with all the ports required by FSx for NetApp ONTAP.
   */
  private static configureConnections(securityGroup: ec2.ISecurityGroup): ec2.Connections {
    const connections = new ec2.Connections({
      securityGroups: [securityGroup],
    });

    return connections;
  }

  /**
   * The security groups/rules used to allow network connections to the file system.
   */
  public readonly connections: ec2.Connections;

  /**
   * The DNS name assigned to this file system.
   */
  public readonly dnsName: string;

  /**
   * The ID that AWS assigns to the file system.
   */
  public readonly fileSystemId: string;

  /**
   * The encapsulated L1 file system.
   */
  private readonly fileSystem: CfnFileSystem;

  constructor(scope: Construct, id: string, props: OntapFileSystemProps) {
    super(scope, id);

    this.validateProps(props);

    const securityGroup = (props.securityGroup || new ec2.SecurityGroup(this, 'FsxOntapSecurityGroup', {
      vpc: props.vpc,
    }));
    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
    });

    const ontapConfiguration = props.ontapConfiguration;

    this.fileSystem = new CfnFileSystem(this, 'Resource', {
      fileSystemType: OntapFileSystem.DEFAULT_FILE_SYSTEM_TYPE,
      subnetIds: [props.vpcSubnet.subnetId],
      backupId: props.backupId,
      kmsKeyId: props.kmsKey?.keyId,
      ontapConfiguration: {
        automaticBackupRetentionDays: ontapConfiguration.automaticBackupRetention?.toDays() ?? 0,
        dailyAutomaticBackupStartTime: ontapConfiguration.dailyAutomaticBackupStartTime?.toTimestamp(),
        deploymentType: ontapConfiguration.deploymentType ?? OntapDeploymentType.MULTI_AZ_2,
        diskIopsConfiguration: {
          mode: ontapConfiguration.diskIops ? 'USER_PROVISIONED' : 'AUTOMATIC',
          iops: ontapConfiguration.diskIops,
        },
        endpointIpAddressRange: ontapConfiguration.endpointIpAddressRange,
        fsxAdminPassword: ontapConfiguration.fsxAdminPassword,
        haPairs: ontapConfiguration.haPairs,
        preferredSubnetId: ontapConfiguration.prefferredSubnet?.subnetId,
        routeTableIds: ontapConfiguration.routeTables?.map((routeTable) => routeTable.routeTableId),
        throughputCapacity: ontapConfiguration.throughputCapacity,
        throughputCapacityPerHaPair: ontapConfiguration.throughputCapacityPerHaPair,
        weeklyMaintenanceStartTime: ontapConfiguration.weeklyMaintenanceStartTime?.toTimestamp(),
      },
      securityGroupIds: [securityGroup.securityGroupId],
      storageCapacity: props.storageCapacityGiB,
    });
    this.fileSystem.applyRemovalPolicy(props.removalPolicy);

    this.fileSystemId = this.fileSystem.ref;
    this.dnsName = `${this.fileSystemId}.fsx.${this.env.region}.${Aws.URL_SUFFIX}`;
  }

  /**
   * Validates the props provided for a new FSx for Ontap file system.
   */
  private validateProps(props: OntapFileSystemProps) {
    const ontapConfiguration = props.ontapConfiguration;
    const deploymentType = ontapConfiguration.deploymentType;

    this.validateHaPairs(deploymentType, ontapConfiguration.haPairs);
    this.validateAutomaticBackupRetention(ontapConfiguration.automaticBackupRetention);
    this.validateDailyAutomaticBackupStartTime(ontapConfiguration.automaticBackupRetention, ontapConfiguration.dailyAutomaticBackupStartTime);
    this.validateDiskIops(props.storageCapacityGiB, ontapConfiguration.diskIops, ontapConfiguration.haPairs);
    this.validateEndpointIpAddressRange(deploymentType, ontapConfiguration.endpointIpAddressRange);
    this.validateFsxAdminPassword(ontapConfiguration.fsxAdminPassword);
    this.validateSubnet(deploymentType, props.vpcSubnet, ontapConfiguration.prefferredSubnet);
    this.validateRouteTables(deploymentType, ontapConfiguration.routeTables);
    this.validateThroughputCapacity(
      deploymentType,
      ontapConfiguration.throughputCapacity,
      ontapConfiguration.throughputCapacityPerHaPair,
      ontapConfiguration.haPairs,
    );
    this.validateStorageCapacity(ontapConfiguration.haPairs, props.storageCapacityGiB);
  }

  private validateAutomaticBackupRetention(automaticBackupRetention?: Duration): void {
    if (automaticBackupRetention == null || automaticBackupRetention.toMilliseconds() === 0) {
      return;
    }
    if (automaticBackupRetention.toMilliseconds() < Duration.days(1).toMilliseconds() || automaticBackupRetention.toDays() > 90) {
      throw new Error('automaticBackupRetention must be between 1 and 90 days or be equal to 0');
    }
  }

  private validateDailyAutomaticBackupStartTime(automaticBackupRetention?: Duration,
    dailyAutomaticBackupStartTime?: DailyAutomaticBackupStartTime): void {
    if (!dailyAutomaticBackupStartTime) {
      return;
    }

    const automaticBackupDisabled = !automaticBackupRetention || automaticBackupRetention?.toDays() === Duration.days(0).toDays();

    if (dailyAutomaticBackupStartTime && automaticBackupDisabled) {
      throw new Error('\'automaticBackupRetention\' period must be set a non-zero day when \'dailyAutomaticBackupStartTime\' is set');
    }
  }

  private validateDiskIops(storageCapacityGiB: number, diskIops?: number, haPairs: number = 1): void {
    if (diskIops == null) {
      return;
    }

    const minDiskIops = storageCapacityGiB * 3 * haPairs;
    const maxDiskIops = 200_000 * haPairs;

    if (diskIops < minDiskIops || diskIops > maxDiskIops) {
      throw new Error(`diskIops must be between ${minDiskIops} and ${maxDiskIops}, got ${diskIops}`);
    }
  }

  private validateEndpointIpAddressRange(deploymentType: OntapDeploymentType, endpointIpAddressRange?: string): void {
    if (endpointIpAddressRange == null) {
      return;
    }
    if (deploymentType !== OntapDeploymentType.MULTI_AZ_1 && deploymentType !== OntapDeploymentType.MULTI_AZ_2) {
      throw new Error('\'endpointIpAddressRange\' can only be specified for deployment types MULTI_AZ_1 and MULTI_AZ_2');
    }
    if (!/^[^\u0000\u0085\u2028\u2029\r\n]{9,17}$/.test(endpointIpAddressRange)) {
      throw new Error('\'endpointIpAddressRange\' must be between 9 and 17 characters long and not contain any of the following characters: \\u0000, \\u0085, \\u2028, \\u2029, \\r, or \\n');
    }
  }

  private validateFsxAdminPassword(fsxAdminPassword?: string): void {
    if (fsxAdminPassword == null) {
      return;
    }
    if (!/^[^\u0000\u0085\u2028\u2029\r\n]{8,50}$/.test(fsxAdminPassword)) {
      throw new Error('\'fsxAdminPassword\' must be between 8 and 50 characters long and not contain any of the following characters: \\u0000, \\u0085, \\u2028, \\u2029, \\r, or \\n');
    }
    // must contain at least one English letter and one number, and must not contain the word 'admin'.
    if (!/[a-zA-Z]/.test(fsxAdminPassword) || !/\d/.test(fsxAdminPassword) || /admin/i.test(fsxAdminPassword)) {
      throw new Error('\'fsxAdminPassword\' must contain at least one English letter and one number, and must not contain the word \'admin\'');
    }
  }

  private validateHaPairs(deploymentType: OntapDeploymentType, haPairs?: number): void {
    if (haPairs == null) {
      return;
    }
    if (!Number.isInteger(haPairs) || haPairs < 1 || haPairs > 12) {
      throw new Error(`\'haPairs\' must be an integer between 1 and 12, got ${haPairs}`);
    }
    if (haPairs > 1 && ([OntapDeploymentType.SINGLE_AZ_1, OntapDeploymentType.MULTI_AZ_1, OntapDeploymentType.MULTI_AZ_2].includes(deploymentType))) {
      throw new Error(`\'haPairs\' must be 1 for deployment type ${deploymentType}`);
    }
  }

  private validateSubnet(deploymentType: OntapDeploymentType, vpcSubnet: ec2.ISubnet, preferredSubnet?: ec2.ISubnet): void {
    if ((deploymentType === OntapDeploymentType.MULTI_AZ_1 || deploymentType === OntapDeploymentType.MULTI_AZ_2) && !preferredSubnet) {
      throw new Error('\'preferredSubnet\' must be specified for deployment types MULTI_AZ_1 and MULTI_AZ_2');
    }
    if ((deploymentType === OntapDeploymentType.SINGLE_AZ_1 || deploymentType === OntapDeploymentType.SINGLE_AZ_2) && preferredSubnet) {
      throw new Error('\'preferredSubnet\' must not be specified for deployment types SINGLE_AZ_1 and SINGLE_AZ_2');
    }
    if (preferredSubnet && preferredSubnet.subnetId === vpcSubnet.subnetId) {
      throw new Error('\'preferredSubnet\' must be different from the \'vpcSubnet\'');
    }
  }

  private validateRouteTables(deploymentType: OntapDeploymentType, routeTables?: ec2.IRouteTable[]): void {
    if (routeTables == null || routeTables.length === 0) {
      return;
    }
    if (deploymentType !== OntapDeploymentType.MULTI_AZ_1 && deploymentType !== OntapDeploymentType.MULTI_AZ_2) {
      throw new Error('\'routeTables\' can be specified for deployment types MULTI_AZ_1 and MULTI_AZ_2');
    }
  }

  private validateThroughputCapacity(
    deploymentType: OntapDeploymentType,
    throughputCapacity?: number,
    throughputCapacityPerHaPair?: number,
    haPair: number = 1,
  ): void {
    if (throughputCapacity == null && throughputCapacityPerHaPair == null) {
      return;
    }
    if (throughputCapacity != null && throughputCapacityPerHaPair != null) {
      throw new Error('\'throughputCapacity\' and \'throughputCapacityPerHaPair\' cannot be specified at the same time');
    }

    // Calculate the throughput per HaPair and use it for validation,
    // regardless of whether `throughputCapacity` or `throughputCapacityPerHaPair` is defined.
    const throughputPerHaPair = throughputCapacityPerHaPair ?? (throughputCapacity! / haPair);

    const validValues: { [key in OntapDeploymentType]: number[] } = {
      SINGLE_AZ_1: [128, 256, 512, 1024, 2048, 4096],
      MULTI_AZ_1: [128, 256, 512, 1024, 2048, 4096],
      SINGLE_AZ_2: [1536, 3072, 6144],
      MULTI_AZ_2: [384, 768, 1536, 3072, 6144],
    };

    const validRange = validValues[deploymentType];
    if (!validRange.includes(throughputPerHaPair)) {
      throw new Error(`'throughputCapacityPerHaPair' and 'throughputCapacity' must be one of the following values for ${deploymentType}: ${validRange.join(', ')}`);
    }
  }

  private validateStorageCapacity(haPairs: number = 1, storageCapacityGiB: number): void {
    if (!Number.isInteger(storageCapacityGiB) || storageCapacityGiB < 1024 * haPairs || storageCapacityGiB > Math.min(1_048_576, 524_288 * haPairs)) {
      throw new Error(`storageCapacityGiB must be an integer between ${1024 * haPairs} and ${Math.min(1_048_576, 524_288 * haPairs)}, got ${storageCapacityGiB}`);
    }
  }
}
