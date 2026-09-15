import type { Construct } from 'constructs';
import type { DailyAutomaticBackupStartTime } from './daily-automatic-backup-start-time';
import type { FileSystemAttributes, FileSystemProps, IFileSystem } from './file-system';
import { FileSystemBase, StorageType } from './file-system';
import { CfnFileSystem } from './fsx.generated';
import type { MaintenanceTime } from './maintenance-time';
import { warnIfPlainTextSecret } from './private/warn-plain-text-secret';
import type { ISecurityGroup, ISubnet, IRouteTable } from '../../aws-ec2';
import { Connections, Port, SecurityGroup } from '../../aws-ec2';
import type { Duration, SecretValue } from '../../core';
import { RemovalPolicy, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The network type for the file system.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-networktype
 */
export enum NetworkType {
  /** IPv4-only file system endpoints */
  IPV4 = 'IPV4',
  /** Dual-stack (IPv4 + IPv6) file system endpoints */
  DUAL = 'DUAL',
}

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
 * Provides static members for common values. Use the constructor directly to specify
 * a custom value if a new option becomes available that isn't yet represented.
 *
 * @see https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-throughput-capacity.html
 */
export class ThroughputCapacityPerHaPair {
  /** 128 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_128 = new ThroughputCapacityPerHaPair(128);
  /** 256 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_256 = new ThroughputCapacityPerHaPair(256);
  /** 384 MBps (Gen2: MULTI_AZ_2) */
  public static readonly MB_PER_SEC_384 = new ThroughputCapacityPerHaPair(384);
  /** 512 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_512 = new ThroughputCapacityPerHaPair(512);
  /** 768 MBps (Gen2: MULTI_AZ_2) */
  public static readonly MB_PER_SEC_768 = new ThroughputCapacityPerHaPair(768);
  /** 1024 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_1024 = new ThroughputCapacityPerHaPair(1024);
  /** 1536 MBps (Gen2: SINGLE_AZ_2, MULTI_AZ_2) */
  public static readonly MB_PER_SEC_1536 = new ThroughputCapacityPerHaPair(1536);
  /** 2048 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_2048 = new ThroughputCapacityPerHaPair(2048);
  /** 3072 MBps (Gen2: SINGLE_AZ_2, MULTI_AZ_2) */
  public static readonly MB_PER_SEC_3072 = new ThroughputCapacityPerHaPair(3072);
  /** 4096 MBps (Gen1: SINGLE_AZ_1, MULTI_AZ_1) */
  public static readonly MB_PER_SEC_4096 = new ThroughputCapacityPerHaPair(4096);
  /** 6144 MBps (Gen2: SINGLE_AZ_2, MULTI_AZ_2) */
  public static readonly MB_PER_SEC_6144 = new ThroughputCapacityPerHaPair(6144);

  /**
   * Specify a custom throughput capacity value.
   * Use this if a new value is available that isn't yet represented by a static member.
   *
   * @param throughput The throughput capacity in MBps.
   */
  constructor(public readonly throughput: number) {}
}

/**
 * Valid per-HA-pair throughput values (MBps) by deployment type. Shared between
 * `validateThroughputCapacityPerHaPair` (per-HA-pair API) and
 * `validateThroughputCapacityRange` (total API) so the two surfaces stay in sync.
 *
 * Source: https://docs.aws.amazon.com/fsx/latest/APIReference/API_UpdateFileSystemOntapConfiguration.html#FSx-UpdateFileSystemOntapConfiguration-request-ThroughputCapacityPerHAPair
 */
const VALID_THROUGHPUT_PER_HA_PAIR: Record<OntapDeploymentType, readonly number[]> = {
  [OntapDeploymentType.SINGLE_AZ_1]: [128, 256, 512, 1024, 2048, 4096],
  [OntapDeploymentType.MULTI_AZ_1]: [128, 256, 512, 1024, 2048, 4096],
  [OntapDeploymentType.SINGLE_AZ_2]: [1536, 3072, 6144],
  [OntapDeploymentType.MULTI_AZ_2]: [384, 768, 1536, 3072, 6144],
};

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
   * @default - Amazon FSx default (30 days)
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
   * @default - automatic (3 IOPS per GiB of storage capacity, multiplied by the number of HA pairs)
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
   * Any `SecretValue` is accepted, but for production you should use one that
   * resolves to a CloudFormation dynamic reference at deploy time (for example
   * from `OntapFileSystemSecret`, `SecretValue.ssmSecure(...)` or
   * `SecretValue.cfnParameter(...)`). A literal `SecretValue.unsafePlainText(...)`
   * will be embedded in the synthesized template and produce a synth-time warning.
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
   * The total throughput capacity for the file system, in megabytes per second (MBps).
   *
   * Mutually exclusive with `throughputCapacityPerHaPair`. For multi-HA-pair
   * (`SINGLE_AZ_2`) deployments, `throughputCapacity` divided by `haPairs` must be
   * a valid `throughputCapacityPerHaPair` value, otherwise FSx returns HTTP 400.
   *
   * For most use cases prefer `throughputCapacityPerHaPair`; this field exists
   * for parity with the underlying CFN property.
   *
   * @default - not set; uses `throughputCapacityPerHaPair` or service default
   */
  readonly throughputCapacity?: number;

  /**
   * The throughput capacity per HA pair for the file system.
   *
   * Mutually exclusive with `throughputCapacity`.
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

  /**
   * The network type of the file system.
   *
   * Set to `NetworkType.DUAL` to enable dual-stack (IPv4 + IPv6) endpoints. The
   * default `NetworkType.IPV4` provides IPv4-only access.
   *
   * @default - service default (IPV4)
   */
  readonly networkType?: NetworkType;
}

/**
 * Interface representing an FSx for NetApp ONTAP file system.
 */
export interface IOntapFileSystem extends IFileSystem {
  /**
   * The management DNS name of the file system.
   * @attribute
   */
  readonly dnsName: string;

  /**
   * The Amazon Resource Name (ARN) of the file system.
   * @attribute
   */
  readonly resourceArn: string;
}

/**
 * The FSx for NetApp ONTAP File System implementation of IFileSystem.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 *
 * @resource AWS::FSx::FileSystem
 */
@propertyInjectable
export class OntapFileSystem extends FileSystemBase implements IOntapFileSystem {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.OntapFileSystem';

  /**
   * Import an existing FSx for NetApp ONTAP file system from the given properties.
   */
  public static fromOntapFileSystemAttributes(scope: Construct, id: string, attrs: OntapFileSystemAttributes): IOntapFileSystem {
    class Import extends FileSystemBase implements IOntapFileSystem {
      public readonly dnsName = attrs.dnsName;
      public readonly fileSystemId = attrs.fileSystemId;
      public readonly connections = OntapFileSystem.configureConnections(attrs.securityGroup);

      /**
       * The Amazon Resource Name (ARN) of the imported file system.
       *
       * Throws a `ValidationError` if accessed when `resourceArn` was not supplied
       * to `fromOntapFileSystemAttributes`. The error is raised eagerly so that
       * downstream code (IAM grants, related-resource ARN composition, etc.) sees
       * a clear CDK-side message instead of a confusing CFN-side failure at
       * deploy time.
       */
      public get resourceArn(): string {
        if (attrs.resourceArn === undefined) {
          throw new ValidationError(
            lit`ImportedFsxResourceArnNotProvided`,
            '\'resourceArn\' was not provided when importing this FSx ONTAP file system. '
              + 'Pass it to \'fromOntapFileSystemAttributes\' to use ARN-dependent APIs.',
            this,
          );
        }
        return attrs.resourceArn;
      }
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
   * The Amazon Resource Name (ARN) of the file system.
   * @attribute
   */
  public readonly resourceArn: string;

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
      networkType: props.networkType,
      ontapConfiguration: {
        // Pass through undefined when unset so Amazon FSx applies its own service-side
        // default (currently 30 days). This avoids pinning consumers to a CDK-side default
        // that could drift from the service if it ever changes.
        automaticBackupRetentionDays: ontapConfig.automaticBackupRetention?.toDays(),
        dailyAutomaticBackupStartTime: ontapConfig.dailyAutomaticBackupStartTime?.toTimestamp(),
        deploymentType: this.deploymentType,
        diskIopsConfiguration: ontapConfig.diskIops != null
          ? { mode: 'USER_PROVISIONED', iops: ontapConfig.diskIops }
          : { mode: 'AUTOMATIC' },
        endpointIpAddressRange: ontapConfig.endpointIpAddressRange,
        endpointIpv6AddressRange: ontapConfig.endpointIpv6AddressRange,
        // `unsafeUnwrap()` is safe here: when `fsxAdminPassword` is built from a token-based
        // SecretValue (Secrets Manager, SSM, CFN parameter, etc.), it returns the dynamic
        // reference string and the password resolves at deploy time. Literal SecretValues
        // are caught by `warnIfPlainTextSecret` (called from `validateProps`).
        fsxAdminPassword: ontapConfig.fsxAdminPassword?.unsafeUnwrap(),
        haPairs: ontapConfig.haPairs,
        preferredSubnetId: ontapConfig.preferredSubnet?.subnetId,
        routeTableIds: ontapConfig.routeTables?.map(rt => rt.routeTableId),
        throughputCapacity: ontapConfig.throughputCapacity,
        throughputCapacityPerHaPair: ontapConfig.throughputCapacityPerHaPair?.throughput,
        weeklyMaintenanceStartTime: ontapConfig.weeklyMaintenanceStartTime?.toTimestamp(),
      },
      securityGroupIds: [securityGroup.securityGroupId],
      storageCapacity: props.storageCapacityGiB,
    });

    // Default to RETAIN: file systems are stateful and own all their SVMs/Volumes.
    // Deleting the file system on stack delete would silently destroy customer data
    // even if the user set RETAIN on individual volumes.
    this.fileSystem.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    this.fileSystemId = this.fileSystem.ref;
    this.dnsName = this.fileSystem.attrDnsName;
    this.resourceArn = this.fileSystem.attrResourceArn;
  }

  private validateProps(props: OntapFileSystemProps): void {
    const ontapConfig = props.ontapConfiguration;
    this.validateHaPairs(ontapConfig.haPairs);
    this.validateAutomaticBackupRetention(ontapConfig.automaticBackupRetention);
    this.validateDailyAutomaticBackupStartTime(ontapConfig.automaticBackupRetention, ontapConfig.dailyAutomaticBackupStartTime);
    this.validateDiskIops(props.storageCapacityGiB, ontapConfig.diskIops, ontapConfig.haPairs);
    this.validateEndpointIpAddressRange(ontapConfig.endpointIpAddressRange);
    this.validateEndpointIpv6AddressRange(ontapConfig.endpointIpv6AddressRange, props.networkType);
    this.validateSubnets(props.vpcSubnets, ontapConfig.preferredSubnet);
    this.validateRouteTables(ontapConfig.routeTables);
    this.validateStorageCapacity(props.storageCapacityGiB, ontapConfig.haPairs);
    this.validateStorageType(props.storageType);
    this.validateThroughputCapacityPerHaPair(ontapConfig.throughputCapacityPerHaPair);
    this.validateThroughputCapacityMutualExclusion(ontapConfig.throughputCapacity, ontapConfig.throughputCapacityPerHaPair);
    this.validateThroughputCapacityRange(ontapConfig.throughputCapacity, ontapConfig.haPairs);
    warnIfPlainTextSecret(this, 'fsxAdminPassword', ontapConfig.fsxAdminPassword);
  }

  private validateHaPairs(haPairs?: number): void {
    if (haPairs == null || Token.isUnresolved(haPairs)) return;
    if (!Number.isInteger(haPairs) || haPairs < 1 || haPairs > 12) {
      throw new ValidationError(lit`HaPairsMustBeBetween1And12`, `'haPairs' must be an integer between 1 and 12, got ${haPairs}`, this);
    }
    // FSx for ONTAP scale-out (multiple HA pairs) is supported only on SINGLE_AZ_2.
    // MULTI_AZ_1, MULTI_AZ_2, and SINGLE_AZ_1 are single HA pair only.
    if (haPairs > 1 && this.deploymentType !== OntapDeploymentType.SINGLE_AZ_2) {
      throw new ValidationError(lit`HaPairsGreaterThan1OnlyForSingleAz2`, `'haPairs' can only be greater than 1 for SINGLE_AZ_2, got ${haPairs} with ${this.deploymentType}`, this);
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
    if (diskIops == null || Token.isUnresolved(diskIops)) return;
    if (!Number.isInteger(diskIops)) {
      throw new ValidationError(lit`DiskIopsMustBeInteger`, `'diskIops' must be an integer, got ${diskIops}`, this);
    }
    // The upper bound is independent of storage capacity, so the check still runs even
    // when storageCapacityGiB is a token. Gen2: 200,000 IOPS per HA pair, capped at the
    // FSx service limit of 2,400,000 (12 HA pairs * 200,000). Gen1: 80,000 (haPairs is
    // enforced to be 1 by validateHaPairs).
    const isSecondGen = this.deploymentType === OntapDeploymentType.SINGLE_AZ_2 || this.deploymentType === OntapDeploymentType.MULTI_AZ_2;
    if (!Token.isUnresolved(haPairs)) {
      const maxIops = isSecondGen ? Math.min(200_000 * haPairs, 2_400_000) : 80_000;
      if (diskIops > maxIops) {
        throw new ValidationError(lit`DiskIopsAboveMax`, `'diskIops' must be at most ${maxIops}, got ${diskIops}`, this);
      }
    }
    // The lower bound (3 IOPS per GiB of total SSD capacity) depends on storageCapacityGiB.
    // Skip when capacity is a token; the FSx service validates the floor at deploy time.
    if (!Token.isUnresolved(storageCapacityGiB)) {
      const minIops = storageCapacityGiB * 3;
      if (diskIops < minIops) {
        throw new ValidationError(lit`DiskIopsBelowMin`, `'diskIops' must be at least ${minIops} (3 IOPS per GiB of storage capacity), got ${diskIops}`, this);
      }
    }
  }

  private validateEndpointIpAddressRange(range?: string): void {
    if (range == null) return;
    // The Multi-AZ scoping check only depends on whether the property is set, so it runs
    // even when the value is a token. Detailed CIDR validation is left to the FSx service.
    if (!this.isMultiAz()) {
      throw new ValidationError(lit`EndpointIpAddressRangeOnlyForMultiAz`, '\'endpointIpAddressRange\' can only be specified for Multi-AZ file systems', this);
    }
  }

  private validateEndpointIpv6AddressRange(range?: string, networkType?: NetworkType): void {
    if (range == null) return;
    // The Multi-AZ scoping check only depends on whether the property is set, so it runs
    // even when the value is a token. Detailed CIDR validation is left to the FSx service.
    if (!this.isMultiAz()) {
      throw new ValidationError(lit`EndpointIpv6AddressRangeOnlyForMultiAz`, '\'endpointIpv6AddressRange\' can only be specified for Multi-AZ file systems', this);
    }
    // IPv6 endpoint ranges are only meaningful on dual-stack file systems. Without
    // `networkType: NetworkType.DUAL` the FSx API silently drops the property.
    if (networkType !== NetworkType.DUAL) {
      throw new ValidationError(
        lit`EndpointIpv6RequiresDualStack`,
        '\'endpointIpv6AddressRange\' requires \'networkType: NetworkType.DUAL\'',
        this,
      );
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
      // Multi-AZ requires the two subnets to be in different AZs. Skip the check if
      // either availability zone is an unresolved token (validation falls back to the
      // FSx service at deploy time).
      const azs = vpcSubnets.map(s => s.availabilityZone);
      if (azs.every(az => !Token.isUnresolved(az)) && azs[0] === azs[1]) {
        throw new ValidationError(lit`MultiAzSubnetsMustBeInDifferentAZs`, `Multi-AZ file systems require the two subnets to be in different availability zones, got both in '${azs[0]}'`, this);
      }
      // FSx requires PreferredSubnetId to be one of the values in SubnetIds. Skip the
      // check if any of the IDs are unresolved tokens (validation falls back to the service).
      const preferredId = preferredSubnet.subnetId;
      if (!Token.isUnresolved(preferredId)) {
        const subnetIds = vpcSubnets.map(s => s.subnetId);
        const allResolved = subnetIds.every(id => !Token.isUnresolved(id));
        if (allResolved && !subnetIds.includes(preferredId)) {
          throw new ValidationError(lit`PreferredSubnetMustBeInVpcSubnets`, '\'preferredSubnet\' must be one of the subnets passed in \'vpcSubnets\'', this);
        }
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

  private validateStorageCapacity(storageCapacityGiB: number, haPairs: number = 1): void {
    if (Token.isUnresolved(storageCapacityGiB) || Token.isUnresolved(haPairs)) return;
    // Minimum storage capacity:
    //   Gen1 (haPairs is enforced to 1 by validateHaPairs): 1024 GiB.
    //   Gen2 SINGLE_AZ_2 (multi-HA scale-out): 1024 GiB per HA pair.
    // The formula collapses to 1024 for Gen1 and 1024 * haPairs for Gen2.
    const minCapacity = 1024 * haPairs;
    const isSecondGen = this.deploymentType === OntapDeploymentType.SINGLE_AZ_2 || this.deploymentType === OntapDeploymentType.MULTI_AZ_2;
    // Gen1: max 196,608 GiB (192 TiB). Gen2: max 524,288 GiB per HA pair, up to 1,048,576 GiB (1 PiB).
    const maxCapacity = isSecondGen
      ? Math.min(1_048_576, 524_288 * haPairs)
      : 196_608;
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

  /**
   * Validates `throughputCapacityPerHaPair` against the deployment type.
   *
   * Source: https://docs.aws.amazon.com/fsx/latest/APIReference/API_UpdateFileSystemOntapConfiguration.html#FSx-UpdateFileSystemOntapConfiguration-request-ThroughputCapacityPerHAPair
   *
   * - SINGLE_AZ_1, MULTI_AZ_1: 128, 256, 512, 1024, 2048, 4096
   * - SINGLE_AZ_2:             1536, 3072, 6144
   * - MULTI_AZ_2:              384, 768, 1536, 3072, 6144
   */
  private validateThroughputCapacityPerHaPair(throughput?: ThroughputCapacityPerHaPair): void {
    if (!throughput) return;
    const value = throughput.throughput;
    if (Token.isUnresolved(value)) return;
    const allowed = VALID_THROUGHPUT_PER_HA_PAIR[this.deploymentType];
    if (!allowed.includes(value)) {
      throw new ValidationError(
        lit`ThroughputCapacityPerHaPairInvalidForDeploymentType`,
        `'throughputCapacityPerHaPair' value ${value} MBps is not valid for ${this.deploymentType}. Valid values: ${allowed.join(', ')} MBps`,
        this,
      );
    }
  }

  private validateThroughputCapacityMutualExclusion(total?: number, perHaPair?: ThroughputCapacityPerHaPair): void {
    if (total != null && perHaPair != null) {
      throw new ValidationError(
        lit`ThroughputCapacityMutuallyExclusive`,
        '\'throughputCapacity\' and \'throughputCapacityPerHaPair\' are mutually exclusive; specify only one',
        this,
      );
    }
  }

  private validateThroughputCapacityRange(total?: number, haPairs?: number): void {
    if (total == null || Token.isUnresolved(total)) return;
    // The lower bound is the smallest valid per-HA-pair value across the deployment-type
    // tables (Gen1: 128, MULTI_AZ_2: 384, SINGLE_AZ_2: 1536). Smaller totals always fail
    // at deploy with `BadRequest` because they cannot be divided into a valid per-HA-pair
    // value, so the synth-time error here is more actionable than the service one.
    const minByDeployment: Record<OntapDeploymentType, number> = {
      [OntapDeploymentType.SINGLE_AZ_1]: 128,
      [OntapDeploymentType.MULTI_AZ_1]: 128,
      [OntapDeploymentType.MULTI_AZ_2]: 384,
      [OntapDeploymentType.SINGLE_AZ_2]: 1536,
    };
    const minTotal = minByDeployment[this.deploymentType];
    // The upper bound is per-HA-pair max times haPairs. For everything except SINGLE_AZ_2,
    // `validateHaPairs` enforces haPairs = 1, so the cap collapses to a single per-HA-pair
    // ceiling (4,096 MBps for Gen1, 6,144 MBps for MULTI_AZ_2). The full 73,728 MBps
    // service hard cap is only reachable on SINGLE_AZ_2 with 12 HA pairs.
    const perHaPairMax: Record<OntapDeploymentType, number> = {
      [OntapDeploymentType.SINGLE_AZ_1]: 4096,
      [OntapDeploymentType.MULTI_AZ_1]: 4096,
      [OntapDeploymentType.MULTI_AZ_2]: 6144,
      [OntapDeploymentType.SINGLE_AZ_2]: 6144,
    };
    // The integer check and the lower-bound check are independent of haPairs (they are
    // deployment-type-only constants), so run them before short-circuiting on a tokenized
    // haPairs. Mirrors the pattern in `validateDiskIops`.
    if (!Number.isInteger(total) || total < minTotal) {
      throw new ValidationError(
        lit`ThroughputCapacityRange`,
        `'throughputCapacity' must be an integer of at least ${minTotal} MBps for ${this.deploymentType}, got ${total}`,
        this,
      );
    }
    // Skip the upper-bound check if haPairs is an unresolved token (the FSx service will
    // validate at deploy time). For other deployment types, validateHaPairs already
    // ensures haPairs is 1 if it was specified, so default to 1 when unset.
    if (Token.isUnresolved(haPairs)) return;
    const effectiveHaPairs = haPairs ?? 1;
    const maxTotal = perHaPairMax[this.deploymentType] * effectiveHaPairs;
    if (total > maxTotal) {
      throw new ValidationError(
        lit`ThroughputCapacityRange`,
        `'throughputCapacity' must be at most ${maxTotal} MBps for ${this.deploymentType}`
          + (this.deploymentType === OntapDeploymentType.SINGLE_AZ_2 ? ` with haPairs=${effectiveHaPairs}` : '')
          + `, got ${total}`,
        this,
      );
    }
    // FSx for ONTAP requires `throughputCapacity` to equal `haPairs * validPerHaPairValue`.
    // The per-HA-pair set is discrete, so values inside the [min, max] window that don't
    // divide evenly are still rejected by the service with `BadRequest`. Mirror the
    // strictness of `validateThroughputCapacityPerHaPair` for the total API.
    const allowedPerHaPair = VALID_THROUGHPUT_PER_HA_PAIR[this.deploymentType];
    if (total % effectiveHaPairs !== 0 || !allowedPerHaPair.includes(total / effectiveHaPairs)) {
      throw new ValidationError(
        lit`ThroughputCapacityNotDivisible`,
        `'throughputCapacity' (${total}) divided by haPairs (${effectiveHaPairs}) must equal a valid per-HA-pair value for ${this.deploymentType}: ${allowedPerHaPair.join(', ')} MBps`,
        this,
      );
    }
  }

  private isMultiAz(): boolean {
    return this.deploymentType === OntapDeploymentType.MULTI_AZ_1 || this.deploymentType === OntapDeploymentType.MULTI_AZ_2;
  }
}

/**
 * Attributes for importing an existing FSx for NetApp ONTAP file system.
 *
 * Extends `FileSystemAttributes` with an optional `resourceArn` for symmetry
 * with the SVM and Volume L2s.
 */
export interface OntapFileSystemAttributes extends FileSystemAttributes {
  /**
   * The Amazon Resource Name (ARN) of the imported file system.
   *
   * Optional: omit this if the importing stack never reads `IOntapFileSystem.resourceArn`.
   * If omitted, accessing `resourceArn` on the imported file system throws a
   * `ValidationError` so downstream consumers (IAM grants, related-resource ARN
   * composition, etc.) get a clear CDK-side error rather than a confusing
   * CFN-side failure at deploy time.
   *
   * @default - not set; accessing `IOntapFileSystem.resourceArn` will throw
   */
  readonly resourceArn?: string;
}

