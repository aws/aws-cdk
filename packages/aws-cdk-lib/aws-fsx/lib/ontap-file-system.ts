import type { Construct } from 'constructs';
import type { DailyAutomaticBackupStartTime } from './daily-automatic-backup-start-time';
import type { FileSystemAttributes, FileSystemProps, IFileSystem } from './file-system';
import { FileSystemBase, StorageType } from './file-system';
import { CfnFileSystem } from './fsx.generated';
import type { MaintenanceTime } from './maintenance-time';
import type { ISecurityGroup, ISubnet, IRouteTable } from '../../aws-ec2';
import { Connections, Port, SecurityGroup } from '../../aws-ec2';
import type { Duration, SecretValue } from '../../core';
import { Aws, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The different kinds of file system deployments used by NetApp ONTAP.
 *
 * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/high-availability-AZ.html
 */
export enum OntapDeploymentType {
  /**
   * A high availability file system configured for Multi-AZ redundancy.
   * This is a first-generation FSx for ONTAP file system.
   */
  MULTI_AZ_1 = 'MULTI_AZ_1',

  /**
   * A high availability file system configured for Multi-AZ redundancy.
   * This is a second-generation FSx for ONTAP file system.
   */
  MULTI_AZ_2 = 'MULTI_AZ_2',

  /**
   * A file system configured for Single-AZ redundancy.
   * This is a first-generation FSx for ONTAP file system.
   */
  SINGLE_AZ_1 = 'SINGLE_AZ_1',

  /**
   * A file system configured with multiple HA pairs for Single-AZ redundancy.
   * This is a second-generation FSx for ONTAP file system.
   */
  SINGLE_AZ_2 = 'SINGLE_AZ_2',
}

/**
 * The throughput capacity per HA pair for an Amazon FSx for NetApp ONTAP file system.
 *
 * Use the static members on the deployment-specific subclasses to select a valid value.
 */
export abstract class ThroughputCapacityPerHaPair {
  /** The deployment type this throughput value is valid for. */
  public abstract readonly deploymentType: OntapDeploymentType;

  protected constructor(
    /** The throughput capacity in MBps. */
    public readonly capacityMBps: number,
  ) {}
}

/**
 * Valid throughput capacity values for SINGLE_AZ_1 (first-generation single-AZ) deployment type.
 *
 * Valid values: 128, 256, 512, 1024, 2048, or 4096 MBps.
 */
export class SingleAz1ThroughputCapacity extends ThroughputCapacityPerHaPair {
  public static readonly MB_PER_SEC_128 = new SingleAz1ThroughputCapacity(128);
  public static readonly MB_PER_SEC_256 = new SingleAz1ThroughputCapacity(256);
  public static readonly MB_PER_SEC_512 = new SingleAz1ThroughputCapacity(512);
  public static readonly MB_PER_SEC_1024 = new SingleAz1ThroughputCapacity(1024);
  public static readonly MB_PER_SEC_2048 = new SingleAz1ThroughputCapacity(2048);
  public static readonly MB_PER_SEC_4096 = new SingleAz1ThroughputCapacity(4096);

  public readonly deploymentType = OntapDeploymentType.SINGLE_AZ_1;

  private constructor(capacity: number) {
    super(capacity);
  }
}

/**
 * Valid throughput capacity values for MULTI_AZ_1 (first-generation multi-AZ) deployment type.
 *
 * Valid values: 128, 256, 512, 1024, 2048, or 4096 MBps.
 */
export class MultiAz1ThroughputCapacity extends ThroughputCapacityPerHaPair {
  public static readonly MB_PER_SEC_128 = new MultiAz1ThroughputCapacity(128);
  public static readonly MB_PER_SEC_256 = new MultiAz1ThroughputCapacity(256);
  public static readonly MB_PER_SEC_512 = new MultiAz1ThroughputCapacity(512);
  public static readonly MB_PER_SEC_1024 = new MultiAz1ThroughputCapacity(1024);
  public static readonly MB_PER_SEC_2048 = new MultiAz1ThroughputCapacity(2048);
  public static readonly MB_PER_SEC_4096 = new MultiAz1ThroughputCapacity(4096);

  public readonly deploymentType = OntapDeploymentType.MULTI_AZ_1;

  private constructor(capacity: number) {
    super(capacity);
  }
}

/**
 * Valid throughput capacity values for SINGLE_AZ_2 (second-generation single-AZ) deployment type.
 *
 * Valid values: 1536, 3072, or 6144 MBps.
 */
export class SingleAz2ThroughputCapacity extends ThroughputCapacityPerHaPair {
  public static readonly MB_PER_SEC_1536 = new SingleAz2ThroughputCapacity(1536);
  public static readonly MB_PER_SEC_3072 = new SingleAz2ThroughputCapacity(3072);
  public static readonly MB_PER_SEC_6144 = new SingleAz2ThroughputCapacity(6144);

  public readonly deploymentType = OntapDeploymentType.SINGLE_AZ_2;

  private constructor(capacity: number) {
    super(capacity);
  }
}

/**
 * Valid throughput capacity values for MULTI_AZ_2 (second-generation multi-AZ) deployment type.
 *
 * Valid values: 384, 768, 1536, 3072, or 6144 MBps.
 */
export class MultiAz2ThroughputCapacity extends ThroughputCapacityPerHaPair {
  public static readonly MB_PER_SEC_384 = new MultiAz2ThroughputCapacity(384);
  public static readonly MB_PER_SEC_768 = new MultiAz2ThroughputCapacity(768);
  public static readonly MB_PER_SEC_1536 = new MultiAz2ThroughputCapacity(1536);
  public static readonly MB_PER_SEC_3072 = new MultiAz2ThroughputCapacity(3072);
  public static readonly MB_PER_SEC_6144 = new MultiAz2ThroughputCapacity(6144);

  public readonly deploymentType = OntapDeploymentType.MULTI_AZ_2;

  private constructor(capacity: number) {
    super(capacity);
  }
}

/**
 * The configuration for the Amazon FSx for NetApp ONTAP file system.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-ontapconfiguration.html
 */
export interface OntapConfiguration {
  /**
   * The number of days to retain automatic backups.
   * Setting this to Duration.days(0) disables automatic backups.
   *
   * @default Duration.days(30)
   */
  readonly automaticBackupRetention?: Duration;

  /**
   * Start time for 30-minute daily automatic backup window in UTC.
   *
   * @default - automatically chosen by Amazon FSx
   */
  readonly dailyAutomaticBackupStartTime?: DailyAutomaticBackupStartTime;

  /**
   * The FSx for ONTAP file system deployment type to use.
   */
  readonly deploymentType: OntapDeploymentType;

  /**
   * The total number of SSD IOPS provisioned for the file system.
   *
   * @default - automatic (3 IOPS per GiB × storage capacity × HA pairs)
   */
  readonly diskIops?: number;

  /**
   * (Multi-AZ only) The IPv4 address range in which the endpoints to access your
   * file system will be created.
   *
   * @default - an unused IP address range from the 198.19.* range
   */
  readonly endpointIpAddressRange?: string;

  /**
   * (Multi-AZ only) The IPv6 address range in which the endpoints to access your
   * file system will be created.
   *
   * @default - automatically selected by Amazon FSx
   */
  readonly endpointIpv6AddressRange?: string;

  /**
   * The ONTAP administrative password for the `fsxadmin` user.
   *
   * @default - no admin password set
   */
  readonly fsxAdminPassword?: SecretValue;

  /**
   * How many high-availability (HA) pairs of file servers will power your file system.
   *
   * @default 1
   */
  readonly haPairs?: number;

  /**
   * Required for Multi-AZ deployments. The subnet in which the preferred file server
   * will be located.
   *
   * @default - no preferred subnet (required for Multi-AZ)
   */
  readonly preferredSubnet?: ISubnet;

  /**
   * (Multi-AZ only) The route tables in which Amazon FSx creates the rules for
   * routing traffic to the correct file server.
   *
   * @default - Amazon FSx selects your VPC's default route table
   */
  readonly routeTables?: IRouteTable[];

  /**
   * The throughput capacity per HA pair for the file system.
   *
   * @default - Amazon FSx determines the throughput based on storage capacity
   */
  readonly throughputCapacityPerHaPair?: ThroughputCapacityPerHaPair;

  /**
   * The preferred day and time to perform weekly maintenance.
   *
   * @default - automatically set by Amazon FSx
   */
  readonly weeklyMaintenanceStartTime?: MaintenanceTime;
}

/**
 * Properties specific to the NetApp ONTAP version of the FSx file system.
 */
export interface OntapFileSystemProps extends FileSystemProps {
  /**
   * The ONTAP-specific configuration for this file system.
   */
  readonly ontapConfiguration: OntapConfiguration;

  /**
   * The subnets that the file system will be accessible from.
   *
   * For MULTI_AZ_1 and MULTI_AZ_2: provide exactly two subnets in different AZs.
   * For SINGLE_AZ_1 and SINGLE_AZ_2: provide exactly one subnet.
   */
  readonly vpcSubnets: ISubnet[];
}

/**
 * The FSx for NetApp ONTAP File System implementation of IFileSystem.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 *
 * @resource AWS::FSx::FileSystem
 */
@propertyInjectable
export class OntapFileSystem extends FileSystemBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.OntapFileSystem';

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

  private static readonly DEFAULT_FILE_SYSTEM_TYPE: string = 'ONTAP';
  private static readonly DEFAULT_PORT = 2049;

  private static configureConnections(securityGroup: ISecurityGroup): Connections {
    return new Connections({
      securityGroups: [securityGroup],
      defaultPort: Port.tcp(OntapFileSystem.DEFAULT_PORT),
    });
  }

  public readonly connections: Connections;
  public readonly dnsName: string;
  public readonly fileSystemId: string;

  /**
   * The inter-cluster endpoint DNS name assigned to this file system.
   */
  public readonly interClusterDnsName: string;

  private readonly fileSystem: CfnFileSystem;
  private readonly deploymentType: OntapDeploymentType;

  constructor(scope: Construct, id: string, props: OntapFileSystemProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.deploymentType = props.ontapConfiguration.deploymentType;
    this.validateProps(props);

    const securityGroup = props.securityGroup || new SecurityGroup(this, 'FsxOntapSecurityGroup', {
      vpc: props.vpc,
    });
    this.connections = OntapFileSystem.configureConnections(securityGroup);

    const ontapConfig = props.ontapConfiguration;
    this.fileSystem = new CfnFileSystem(this, 'Resource', {
      fileSystemType: OntapFileSystem.DEFAULT_FILE_SYSTEM_TYPE,
      subnetIds: props.vpcSubnets.map(subnet => subnet.subnetId),
      backupId: props.backupId,
      kmsKeyId: props.kmsKey ? props.kmsKey.keyRef.keyId : undefined,
      ontapConfiguration: {
        automaticBackupRetentionDays: ontapConfig.automaticBackupRetention?.toDays() ?? 30,
        dailyAutomaticBackupStartTime: ontapConfig.dailyAutomaticBackupStartTime?.toTimestamp(),
        deploymentType: this.deploymentType,
        diskIopsConfiguration: ontapConfig.diskIops != null
          ? { mode: 'USER_PROVISIONED', iops: ontapConfig.diskIops }
          : { mode: 'AUTOMATIC' },
        endpointIpAddressRange: ontapConfig.endpointIpAddressRange,
        endpointIpv6AddressRange: ontapConfig.endpointIpv6AddressRange,
        fsxAdminPassword: ontapConfig.fsxAdminPassword?.unsafeUnwrap(),
        haPairs: ontapConfig.haPairs,
        preferredSubnetId: ontapConfig.preferredSubnet?.subnetId,
        routeTableIds: ontapConfig.routeTables?.map(rt => rt.routeTableId),
        throughputCapacityPerHaPair: ontapConfig.throughputCapacityPerHaPair?.capacityMBps,
        weeklyMaintenanceStartTime: ontapConfig.weeklyMaintenanceStartTime?.toTimestamp(),
      },
      securityGroupIds: [securityGroup.securityGroupId],
      storageCapacity: props.storageCapacityGiB,
    });

    this.fileSystem.applyRemovalPolicy(props.removalPolicy);

    this.fileSystemId = this.fileSystem.ref;
    this.dnsName = this.fileSystem.attrDnsName;
    this.interClusterDnsName = `intercluster.${this.fileSystemId}.fsx.${this.env.region}.${Aws.URL_SUFFIX}`;
  }

  private validateProps(props: OntapFileSystemProps): void {
    const ontapConfig = props.ontapConfiguration;
    this.validateHaPairs(ontapConfig.haPairs);
    this.validateAutomaticBackupRetention(ontapConfig.automaticBackupRetention);
    this.validateDailyAutomaticBackupStartTime(ontapConfig.automaticBackupRetention, ontapConfig.dailyAutomaticBackupStartTime);
    this.validateDiskIops(props.storageCapacityGiB, ontapConfig.diskIops, ontapConfig.haPairs);
    this.validateEndpointIpAddressRange(ontapConfig.endpointIpAddressRange);
    this.validateEndpointIpv6AddressRange(ontapConfig.endpointIpv6AddressRange);
    this.validateSubnets(props.vpcSubnets, ontapConfig.preferredSubnet);
    this.validateRouteTables(ontapConfig.routeTables);
    this.validateThroughputCapacity(ontapConfig.throughputCapacityPerHaPair);
    this.validateStorageCapacity(props.storageCapacityGiB, ontapConfig.haPairs);
    this.validateStorageType(props.storageType);
  }

  private validateHaPairs(haPairs?: number): void {
    if (haPairs == null || Token.isUnresolved(haPairs)) return;
    if (!Number.isInteger(haPairs) || haPairs < 1 || haPairs > 12) {
      throw new ValidationError(lit`HaPairsMustBeBetween1And12`, `'haPairs' must be an integer between 1 and 12, got ${haPairs}`, this);
    }
    if (haPairs > 1
      && this.deploymentType !== OntapDeploymentType.SINGLE_AZ_2
      && this.deploymentType !== OntapDeploymentType.MULTI_AZ_2) {
      throw new ValidationError(lit`HaPairsGreaterThan1OnlyForGen2`, `'haPairs' can only be greater than 1 for second-generation deployment types (SINGLE_AZ_2, MULTI_AZ_2), got ${haPairs} with ${this.deploymentType}`, this);
    }
  }

  private validateAutomaticBackupRetention(retention?: Duration): void {
    if (retention == null || Token.isUnresolved(retention.toDays())) return;
    const days = retention.toDays();
    if (!Number.isInteger(days) || (days !== 0 && (days < 1 || days > 90))) {
      throw new ValidationError(lit`AutomaticBackupRetentionMustBe0Or1To90`, `'automaticBackupRetention' must be a whole number of days between 1 and 90, or 0 to disable. Got: ${days} days`, this);
    }
  }

  private validateDailyAutomaticBackupStartTime(retention?: Duration, startTime?: DailyAutomaticBackupStartTime): void {
    if (!startTime) return;
    const backupDisabled = retention?.toDays() === 0;
    if (backupDisabled) {
      throw new ValidationError(lit`DailyBackupStartTimeRequiresRetention`, '\'dailyAutomaticBackupStartTime\' cannot be set when automatic backups are disabled', this);
    }
  }

  private validateDiskIops(storageCapacityGiB: number, diskIops?: number, haPairs: number = 1): void {
    if (diskIops == null || Token.isUnresolved(diskIops) || Token.isUnresolved(storageCapacityGiB) || Token.isUnresolved(haPairs)) return;
    const minIops = storageCapacityGiB * 3 * haPairs;
    const isSecondGen = this.deploymentType === OntapDeploymentType.SINGLE_AZ_2 || this.deploymentType === OntapDeploymentType.MULTI_AZ_2;
    const maxIops = isSecondGen ? 200_000 * haPairs : 80_000;
    if (!Number.isInteger(diskIops) || diskIops < minIops || diskIops > maxIops) {
      throw new ValidationError(lit`DiskIopsMustBeInRange`, `'diskIops' must be an integer between ${minIops} and ${maxIops}, got ${diskIops}`, this);
    }
  }

  private validateEndpointIpAddressRange(range?: string): void {
    if (range == null || Token.isUnresolved(range)) return;
    if (!this.isMultiAz()) {
      throw new ValidationError(lit`EndpointIpAddressRangeOnlyForMultiAz`, '\'endpointIpAddressRange\' can only be specified for Multi-AZ file systems', this);
    }
    if (range.length < 9 || range.length > 17) {
      throw new ValidationError(lit`EndpointIpAddressRangeLength`, `'endpointIpAddressRange' must be between 9 and 17 characters, got ${range.length}`, this);
    }
  }

  private validateEndpointIpv6AddressRange(range?: string): void {
    if (range == null || Token.isUnresolved(range)) return;
    if (!this.isMultiAz()) {
      throw new ValidationError(lit`EndpointIpv6AddressRangeOnlyForMultiAz`, '\'endpointIpv6AddressRange\' can only be specified for Multi-AZ file systems', this);
    }
  }

  private validateSubnets(vpcSubnets: ISubnet[], preferredSubnet?: ISubnet): void {
    if (this.isMultiAz()) {
      if (!preferredSubnet) {
        throw new ValidationError(lit`PreferredSubnetRequiredForMultiAz`, `'preferredSubnet' must be specified for Multi-AZ file systems (${this.deploymentType})`, this);
      }
      if (vpcSubnets.length !== 2) {
        throw new ValidationError(lit`MultiAzRequiresExactlyTwoSubnets`, `Multi-AZ file systems require exactly 2 subnets in different AZs, got ${vpcSubnets.length}`, this);
      }
    } else {
      if (preferredSubnet) {
        throw new ValidationError(lit`PreferredSubnetOnlyForMultiAz`, '\'preferredSubnet\' can only be specified for Multi-AZ file systems', this);
      }
      if (vpcSubnets.length !== 1) {
        throw new ValidationError(lit`SingleAzRequiresExactlyOneSubnet`, `Single-AZ file systems require exactly 1 subnet, got ${vpcSubnets.length}`, this);
      }
    }
  }

  private validateRouteTables(routeTables?: IRouteTable[]): void {
    if (!routeTables || routeTables.length === 0) return;
    if (!this.isMultiAz()) {
      throw new ValidationError(lit`RouteTablesOnlyForMultiAz`, '\'routeTables\' can only be specified for Multi-AZ file systems', this);
    }
  }

  private validateThroughputCapacity(throughput?: ThroughputCapacityPerHaPair): void {
    if (!throughput) return;
    if (throughput.deploymentType !== this.deploymentType) {
      throw new ValidationError(lit`ThroughputCapacityMustMatchDeploymentType`, `'throughputCapacityPerHaPair' must match deployment type '${this.deploymentType}', but got throughput for '${throughput.deploymentType}'`, this);
    }
  }

  private validateStorageCapacity(storageCapacityGiB: number, haPairs: number = 1): void {
    if (Token.isUnresolved(storageCapacityGiB) || Token.isUnresolved(haPairs)) return;
    const minCapacity = 1024 * haPairs;
    const maxCapacity = Math.min(1_048_576, 524_288 * haPairs);
    if (!Number.isInteger(storageCapacityGiB) || storageCapacityGiB < minCapacity || storageCapacityGiB > maxCapacity) {
      throw new ValidationError(lit`StorageCapacityMustBeInRange`, `'storageCapacityGiB' must be an integer between ${minCapacity} and ${maxCapacity}, got ${storageCapacityGiB}`, this);
    }
  }

  private validateStorageType(storageType?: StorageType): void {
    if (!storageType) return;
    if (storageType !== StorageType.SSD) {
      throw new ValidationError(lit`OntapOnlySupportsSsd`, `FSx for ONTAP only supports SSD storage type, got '${storageType}'`, this);
    }
  }

  private isMultiAz(): boolean {
    return this.deploymentType === OntapDeploymentType.MULTI_AZ_1 || this.deploymentType === OntapDeploymentType.MULTI_AZ_2;
  }
}
