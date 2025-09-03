import { Construct } from 'constructs';
import { DailyAutomaticBackupStartTime } from './daily-automatic-backup-start-time';
import { FileSystemAttributes, FileSystemBase, FileSystemProps, IFileSystem, StorageType } from './file-system';
import { CfnFileSystem } from './fsx.generated';
import { LustreMaintenanceTime } from './maintenance-time';
import { Connections, ISecurityGroup, ISubnet, Port, SecurityGroup } from '../../aws-ec2';
import { Aws, Duration, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The Lustre version for the file system.
 */
export enum FileSystemTypeVersion {
  /**
   * Version 2.10
   */
  V_2_10 = '2.10',

  /**
   * Version 2.12
   */
  V_2_12 = '2.12',

  /**
   * Version 2.15
   */
  V_2_15 = '2.15',
}

/**
 * The different kinds of file system deployments used by Lustre.
 */
export enum LustreDeploymentType {
  /**
   * Original type for shorter term data processing. Data is not replicated and does not persist on server fail.
   */
  SCRATCH_1 = 'SCRATCH_1',
  /**
   * Newer type for shorter term data processing. Data is not replicated and does not persist on server fail.
   * Provides better support for spiky workloads.
   */
  SCRATCH_2 = 'SCRATCH_2',
  /**
   * Long term storage. Data is replicated and file servers are replaced if they fail.
   */
  PERSISTENT_1 = 'PERSISTENT_1',
  /**
   * Newer type of long term storage with higher throughput tiers.
   * Data is replicated and file servers are replaced if they fail.
   */
  PERSISTENT_2 = 'PERSISTENT_2',
}
/**
 * The different auto import policies which are allowed
 */
export enum LustreAutoImportPolicy {
  /**
   * AutoImport is off. Amazon FSx only updates file and directory listings from the linked S3 bucket when the file system is created. FSx does not update file and directory listings for any new or changed objects after choosing this option.
   */
  NONE = 'NONE',
  /**
   * AutoImport is on. Amazon FSx automatically imports directory listings of any new objects added to the linked S3 bucket that do not currently exist in the FSx file system.
   */
  NEW = 'NEW',
  /**
   * AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket and any existing objects that are changed in the S3 bucket after you choose this option.
   */
  NEW_CHANGED = 'NEW_CHANGED',
  /**
   * AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket, any existing objects that are changed in the S3 bucket, and any objects that were deleted in the S3 bucket.
   * */
  NEW_CHANGED_DELETED = 'NEW_CHANGED_DELETED',
}

/**
 * The type of drive cache used by PERSISTENT_1 file systems that are provisioned with HDD storage devices.
 */
export enum DriveCacheType {
  /**
   * The Lustre file system is configured with no data cache.
   */
  NONE = 'NONE',
  /**
   * The Lustre file system is configured with a read cache.
   */
  READ = 'READ',
}

/**
 * The permitted Lustre data compression algorithms
 */
export enum LustreDataCompressionType {
  /**
   *
   * `NONE` - (Default) Data compression is turned off when the file system is created.
   */
  NONE = 'NONE',
  /**
   * `LZ4` - Data compression is turned on with the LZ4 algorithm.  Note: When you turn data compression on for an existing file system, only newly written files are compressed. Existing files are not compressed.
   */
  LZ4 = 'LZ4',
}

/**
 * The configuration for the Amazon FSx for Lustre file system.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html
 */
export interface LustreConfiguration {
  /**
   * The type of backing file system deployment used by FSx.
   */
  readonly deploymentType: LustreDeploymentType;

  /**
   * The path in Amazon S3 where the root of your Amazon FSx file system is exported. The path must use the same
   * Amazon S3 bucket as specified in ImportPath. If you only specify a bucket name, such as s3://import-bucket, you
   * get a 1:1 mapping of file system objects to S3 bucket objects. This mapping means that the input data in S3 is
   * overwritten on export. If you provide a custom prefix in the export path, such as
   * s3://import-bucket/[custom-optional-prefix], Amazon FSx exports the contents of your file system to that export
   * prefix in the Amazon S3 bucket.
   *
   * @default s3://import-bucket/FSxLustre[creation-timestamp]
   */
  readonly exportPath?: string;

  /**
   * For files imported from a data repository, this value determines the stripe count and maximum amount of data per
   * file (in MiB) stored on a single physical disk. Allowed values are between 1 and 512,000.
   *
   * @default 1024
   */
  readonly importedFileChunkSizeMiB?: number;

  /**
   * The path to the Amazon S3 bucket (including the optional prefix) that you're using as the data repository for
   * your Amazon FSx for Lustre file system. Must be of the format "s3://{bucketName}/optional-prefix" and cannot
   * exceed 900 characters.
   *
   * @default - no bucket is imported
   */
  readonly importPath?: string;

  /**
   * Available with `Scratch` and `Persistent_1` deployment types. When you create your file system, your existing S3 objects appear as file and directory listings. Use this property to choose how Amazon FSx keeps your file and directory listings up to date as you add or modify objects in your linked S3 bucket. `AutoImportPolicy` can have the following values:
   *
   * For more information, see [Automatically import updates from your S3 bucket](https://docs.aws.amazon.com/fsx/latest/LustreGuide/autoimport-data-repo.html) .
   *
   * > This parameter is not supported for Lustre file systems using the `Persistent_2` deployment type.
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-autoimportpolicy
   * @default - no import policy
   */
  readonly autoImportPolicy?: LustreAutoImportPolicy;

  /**
   * Sets the data compression configuration for the file system.
   * For more information, see [Lustre data compression](https://docs.aws.amazon.com/fsx/latest/LustreGuide/data-compression.html) in the *Amazon FSx for Lustre User Guide* .
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-filesystem-lustreconfiguration.html#cfn-fsx-filesystem-lustreconfiguration-datacompressiontype
   * @default - no compression
   */

  readonly dataCompressionType?: LustreDataCompressionType;

  /**
   * Provisions the amount of read and write throughput for each 1 tebibyte (TiB) of file system storage capacity, in MB/s/TiB.
   * Required with PERSISTENT_1 and PERSISTENT_2 deployment types.
   *
   * Valid values:
   * - For PERSISTENT_1 SSD storage: 50, 100, 200 MB/s/TiB.
   * - For PERSISTENT_1 HDD storage: 12, 40 MB/s/TiB.
   * - For PERSISTENT_2 SSD storage: 125, 250, 500, 1000 MB/s/TiB.
   *
   * @default - no default, conditionally required for PERSISTENT_1 and PERSISTENT_2 deployment type
   */
  readonly perUnitStorageThroughput?: number;

  /**
   * The preferred day and time to perform weekly maintenance. The first digit is the day of the week, starting at 1
   * for Monday, then the following are hours and minutes in the UTC time zone, 24 hour clock. For example: '2:20:30'
   * is Tuesdays at 20:30.
   *
   * @default - no preference
   */
  readonly weeklyMaintenanceStartTime?: LustreMaintenanceTime;

  /**
   * The number of days to retain automatic backups.
   * Setting this property to 0 disables automatic backups.
   * You can retain automatic backups for a maximum of 90 days.
   *
   * Automatic Backups is not supported on scratch file systems.
   *
   * @default Duration.days(0)
   */
  readonly automaticBackupRetention?: Duration;

  /**
   * A boolean flag indicating whether tags for the file system should be copied to backups.
   *
   * @default - false
   */
  readonly copyTagsToBackups?: boolean;

  /**
   * Start time for 30-minute daily automatic backup window in Coordinated Universal Time (UTC).
   *
   * @default - no backup window
   */
  readonly dailyAutomaticBackupStartTime?: DailyAutomaticBackupStartTime;

  /**
   * The type of drive cache used by PERSISTENT_1 file systems that are provisioned with HDD storage devices.
   *
   * @default - no drive cache
   */
  readonly driveCacheType?: DriveCacheType;
}

/**
 * Properties specific to the Lustre version of the FSx file system.
 */
export interface LustreFileSystemProps extends FileSystemProps {
  /**
   * Additional configuration for FSx specific to Lustre.
   */
  readonly lustreConfiguration: LustreConfiguration;

  /**
   * The Lustre version for the file system.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtypeversion
   *
   * @default - V_2_10, except for PERSISTENT_2 deployment type, where it is V_2_12 without metadata configuration mode and V_2_15 with metadata configuration mode.
   */
  readonly fileSystemTypeVersion?: FileSystemTypeVersion;

  /**
   * The subnet that the file system will be accessible from.
   */
  readonly vpcSubnet: ISubnet;
}

/**
 * The FSx for Lustre File System implementation of IFileSystem.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 *
 * @resource AWS::FSx::FileSystem
 */
@propertyInjectable
export class LustreFileSystem extends FileSystemBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.LustreFileSystem';

  /**
   * Import an existing FSx for Lustre file system from the given properties.
   */
  public static fromLustreFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    class Import extends FileSystemBase {
      public readonly dnsName = attrs.dnsName;
      public readonly fileSystemId = attrs.fileSystemId;
      public readonly connections = LustreFileSystem.configureConnections(attrs.securityGroup);
    }

    return new Import(scope, id);
  }

  /**
   * The default FSx file system type used by FSx for Lustre.
   */
  private static readonly DEFAULT_FILE_SYSTEM_TYPE: string = 'LUSTRE';

  /**
   * The default ports the file system listens on. Actual port list is: [988, 1021, 1022, 1023]
   */
  private static readonly DEFAULT_PORT_RANGE = { startPort: 988, endPort: 1023 };

  /**
   * Configures a Connections object with all the ports required by FSx for Lustre
   */
  private static configureConnections(securityGroup: ISecurityGroup): Connections {
    const connections = new Connections({
      securityGroups: [securityGroup],
      defaultPort: Port.tcpRange(
        LustreFileSystem.DEFAULT_PORT_RANGE.startPort,
        LustreFileSystem.DEFAULT_PORT_RANGE.endPort),
    });

    return connections;
  }

  /**
   * The security groups/rules used to allow network connections to the file system.
   */
  public readonly connections: Connections;

  /**
   * The DNS name assigned to this file system.
   */
  public readonly dnsName: string;

  /**
   * The ID that AWS assigns to the file system.
   */
  public readonly fileSystemId: string;

  /**
   * The mount name of the file system, generated by FSx
   *
   * @attribute LustreMountName
   */
  public readonly mountName: string;

  /**
   * The encapsulated L1 file system.
   */
  private readonly fileSystem: CfnFileSystem;

  constructor(scope: Construct, id: string, props: LustreFileSystemProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.validateProps(props);

    const updatedLustureProps = {
      importedFileChunkSize: props.lustreConfiguration.importedFileChunkSizeMiB,
      weeklyMaintenanceStartTime: props.lustreConfiguration.weeklyMaintenanceStartTime?.toTimestamp(),
      automaticBackupRetentionDays: props.lustreConfiguration.automaticBackupRetention?.toDays(),
      dailyAutomaticBackupStartTime: props.lustreConfiguration.dailyAutomaticBackupStartTime?.toTimestamp(),
      driveCacheType: props.lustreConfiguration.driveCacheType ?? (props.storageType === StorageType.HDD ? DriveCacheType.NONE : undefined),
    };
    const lustreConfiguration = Object.assign({}, props.lustreConfiguration, updatedLustureProps);

    const securityGroup = (props.securityGroup || new SecurityGroup(this, 'FsxLustreSecurityGroup', {
      vpc: props.vpc,
    }));
    securityGroup.addIngressRule(
      securityGroup,
      Port.tcpRange(LustreFileSystem.DEFAULT_PORT_RANGE.startPort, LustreFileSystem.DEFAULT_PORT_RANGE.endPort));
    this.connections = LustreFileSystem.configureConnections(securityGroup);

    this.fileSystem = new CfnFileSystem(this, 'Resource', {
      fileSystemType: LustreFileSystem.DEFAULT_FILE_SYSTEM_TYPE,
      subnetIds: [props.vpcSubnet.subnetId],
      backupId: props.backupId,
      kmsKeyId: (props.kmsKey ? props.kmsKey.keyRef.keyId : undefined),
      lustreConfiguration,
      securityGroupIds: [securityGroup.securityGroupId],
      storageCapacity: props.storageCapacityGiB,
      fileSystemTypeVersion: props.fileSystemTypeVersion,
      storageType: props.storageType,
    });
    this.fileSystem.applyRemovalPolicy(props.removalPolicy);

    this.fileSystemId = this.fileSystem.ref;
    this.dnsName = `${this.fileSystemId}.fsx.${this.env.region}.${Aws.URL_SUFFIX}`;
    this.mountName = this.fileSystem.attrLustreMountName;
  }

  /**
   * Validates the props provided for a new FSx for Lustre file system.
   */
  private validateProps(props: LustreFileSystemProps) {
    const lustreConfiguration = props.lustreConfiguration;
    const deploymentType = lustreConfiguration.deploymentType;
    const perUnitStorageThroughput = lustreConfiguration.perUnitStorageThroughput;

    // Make sure the import path is valid before validating the export path
    this.validateImportPath(lustreConfiguration.importPath);
    this.validateExportPath(lustreConfiguration.exportPath, lustreConfiguration.importPath);

    this.validateImportedFileChunkSize(lustreConfiguration.importedFileChunkSizeMiB);
    this.validateAutoImportPolicy(deploymentType, lustreConfiguration.importPath, lustreConfiguration.autoImportPolicy);

    this.validateAutomaticBackupRetention(deploymentType, lustreConfiguration.automaticBackupRetention);

    this.validateDailyAutomaticBackupStartTime(lustreConfiguration.automaticBackupRetention, lustreConfiguration.dailyAutomaticBackupStartTime);
    this.validatePerUnitStorageThroughput(deploymentType, perUnitStorageThroughput, props.storageType);
    this.validateStorageCapacity(deploymentType, props.storageCapacityGiB, props.storageType, perUnitStorageThroughput);
    this.validateStorageType(deploymentType, props.storageType);
    this.validateDriveCacheType(deploymentType, props.storageType, lustreConfiguration.driveCacheType);
    this.validateFiileSystemTypeVersion(deploymentType, props.fileSystemTypeVersion);
  }

  /**
   * Validates the drive cache type is only set for the PERSISTENT_1 deployment type and HDD storage type.
   */
  private validateDriveCacheType(deploymentType: LustreDeploymentType, storageType?: StorageType, driveCacheType?: DriveCacheType): void {
    if (!driveCacheType) return;

    if (deploymentType !== LustreDeploymentType.PERSISTENT_1 || storageType !== StorageType.HDD) {
      throw new ValidationError(`driveCacheType can only be set for PERSISTENT_1 HDD storage type, got: ${deploymentType} and ${storageType}`, this);
    }
  }

  /**
   * Validates if the storage type corresponds to the appropriate deployment type.
   */
  private validateStorageType(deploymentType: LustreDeploymentType, storageType?: StorageType): void {
    if (!storageType) return;

    if (storageType === StorageType.HDD && deploymentType !== LustreDeploymentType.PERSISTENT_1) {
      throw new ValidationError(`Storage type HDD is only supported for PERSISTENT_1 deployment type, got: ${deploymentType}`, this);
    }
  }

  /**
   * Validates the file system type version
   */
  private validateFiileSystemTypeVersion(deploymentType: LustreDeploymentType, fileSystemTypeVersion?: FileSystemTypeVersion): void {
    if (fileSystemTypeVersion === undefined) {
      return;
    }

    if (fileSystemTypeVersion === FileSystemTypeVersion.V_2_10) {
      if (!deploymentType.startsWith('SCRATCH') && deploymentType !== LustreDeploymentType.PERSISTENT_1) {
        throw new ValidationError('fileSystemTypeVersion V_2_10 is only supported for SCRATCH and PERSISTENT_1 deployment types', this);
      }
    }

    // TODO: Add validation for V_2_12 with PERSISTENT_2 deployment mode and metadata configuration mode when metadata configuration is supported.
  }

  /**
   * Validates the auto import policy
   */
  private validateAutoImportPolicy(deploymentType: LustreDeploymentType, importPath?: string, autoImportPolicy?: LustreAutoImportPolicy): void {
    if (autoImportPolicy === undefined) { return; }
    if (importPath === undefined) {
      throw new ValidationError('autoImportPolicy requires importPath to be defined', this);
    }
    if (deploymentType === LustreDeploymentType.PERSISTENT_2) {
      throw new ValidationError('autoImportPolicy is not supported with PERSISTENT_2 deployments', this);
    }
  }

  /**
   * Validates the export path is in the correct format and matches the import path.
   */
  private validateExportPath(exportPath?: string, importPath?: string): void {
    if (exportPath === undefined) { return; }
    if (importPath === undefined) {
      throw new ValidationError('Cannot define an export path without also defining an import path', this);
    }

    if (Token.isUnresolved(exportPath) && Token.isUnresolved(importPath)) { return; }

    if (Token.isUnresolved(importPath) !== Token.isUnresolved(exportPath)) {
      throw new ValidationError('The importPath and exportPath must each be Tokens or not Tokens, you cannot use a mix', this);
    }
    if (!exportPath.startsWith(importPath)) {
      throw new ValidationError(`The export path "${exportPath}" is invalid. Expecting the format: s3://{IMPORT_PATH}/optional-prefix`, this);
    }
    if (exportPath.length > 900) {
      throw new ValidationError(`The export path "${exportPath}" exceeds the maximum length of 900 characters`, this);
    }
  }

  /**
   * Validates the importedFileChunkSize is in the correct range.
   */
  private validateImportedFileChunkSize(importedFileChunkSize?: number): void {
    if (importedFileChunkSize === undefined) { return; }

    if (importedFileChunkSize < 1 || importedFileChunkSize > 512000) {
      throw new ValidationError(`importedFileChunkSize cannot be ${importedFileChunkSize} MiB. It must be a value from 1 to 512,000 MiB`, this);
    }
  }

  /**
   * Validates the import path is the correct format.
   */
  private validateImportPath(importPath?: string): void {
    if (importPath === undefined || Token.isUnresolved(importPath)) { return; }

    const regexp = /^s3:\/\//;

    if (importPath.search(regexp) === -1) {
      throw new ValidationError(`The import path "${importPath}" is invalid. Expecting the format: s3://{BUCKET_NAME}/optional-prefix`, this);
    }
    if (importPath.length > 900) {
      throw new ValidationError(`The import path "${importPath}" exceeds the maximum length of 900 characters`, this);
    }
  }

  /**
   * Validates the perUnitStorageThroughput is defined correctly for the given deploymentType.
   *
   * @see https://docs.aws.amazon.com/fsx/latest/LustreGuide/managing-throughput-capacity.html
   */
  private validatePerUnitStorageThroughput(
    deploymentType: LustreDeploymentType,
    perUnitStorageThroughput?: number,
    storageType?: StorageType,
  ): void {
    if (perUnitStorageThroughput === undefined) { return; }

    if (deploymentType !== LustreDeploymentType.PERSISTENT_1 && deploymentType !== LustreDeploymentType.PERSISTENT_2) {
      throw new ValidationError('perUnitStorageThroughput can only be set for the PERSISTENT_1/PERSISTENT_2 deployment types, received: ' + deploymentType, this);
    }

    if (deploymentType === LustreDeploymentType.PERSISTENT_1) {
      if (storageType === StorageType.HDD && ![12, 40].includes(perUnitStorageThroughput)) {
        throw new ValidationError(`perUnitStorageThroughput must be 12 or 40 MB/s/TiB for PERSISTENT_1 HDD storage, got: ${perUnitStorageThroughput}`, this);
      }
      if ((storageType === undefined || storageType === StorageType.SSD) && ![50, 100, 200].includes(perUnitStorageThroughput)) {
        throw new ValidationError('perUnitStorageThroughput must be 50, 100, or 200 MB/s/TiB for PERSISTENT_1 SSD storage, got: ' + perUnitStorageThroughput, this);
      }
    }

    if (deploymentType === LustreDeploymentType.PERSISTENT_2) {
      if (![125, 250, 500, 1000].includes(perUnitStorageThroughput)) {
        throw new ValidationError(`perUnitStorageThroughput must be 125, 250, 500 or 1000 MB/s/TiB for PERSISTENT_2 deployment type, got: ${perUnitStorageThroughput}`, this);
      }
    }
  }

  /**
   * Validates the storage capacity is an acceptable value for the deployment type.
   *
   * @see https://docs.aws.amazon.com/fsx/latest/LustreGuide/increase-storage-capacity.html
   */
  private validateStorageCapacity(
    deploymentType: LustreDeploymentType,
    storageCapacity: number,
    storageType?: StorageType,
    perUnitStorageThroughput?: number,
  ): void {
    if (deploymentType === LustreDeploymentType.SCRATCH_1) {
      if (![1200, 2400, 3600].includes(storageCapacity) && storageCapacity % 3600 !== 0) {
        throw new ValidationError(`storageCapacity must be 1,200, 2,400, 3,600, or a multiple of 3,600 for SCRATCH_1 deployment type, got ${storageCapacity}.`, this);
      }
    }

    if (
      deploymentType === LustreDeploymentType.PERSISTENT_2
      || deploymentType === LustreDeploymentType.SCRATCH_2
    ) {
      if (![1200, 2400].includes(storageCapacity) && storageCapacity % 2400 !== 0) {
        throw new ValidationError(`storageCapacity must be 1,200, 2,400, or a multiple of 2,400 for SCRATCH_2 and PERSISTENT_2 deployment types, got ${storageCapacity}`, this);
      }
    }

    if (deploymentType === LustreDeploymentType.PERSISTENT_1) {
      if (storageType === StorageType.HDD) {
        if (perUnitStorageThroughput === 12 && storageCapacity % 6000 !== 0) {
          throw new ValidationError(`storageCapacity must be a multiple of 6,000 for PERSISTENT_1 HDD storage with 12 MB/s/TiB throughput, got ${storageCapacity}`, this);
        }
        if (perUnitStorageThroughput === 40 && storageCapacity % 1800 !== 0) {
          throw new ValidationError(`storageCapacity must be a multiple of 1,800 for PERSISTENT_1 HDD storage with 40 MB/s/TiB throughput, got ${storageCapacity}`, this);
        }
      } else {
        if (![1200, 2400].includes(storageCapacity) && storageCapacity % 2400 !== 0) {
          throw new ValidationError(`storageCapacity must be 1,200, 2,400, or a multiple of 2,400 for PERSISTENT_1 SSD storage, got ${storageCapacity}`, this);
        }
      }
    }
  }

  /**
   * Validates the automaticBackupRetention with a non-scratch deployment class and an acceptable day value.
   */
  private validateAutomaticBackupRetention(deploymentType: LustreDeploymentType, automaticBackupRetention?: Duration): void {
    if (automaticBackupRetention) {
      const automaticBackupRetentionDays = automaticBackupRetention.toDays();

      if ([LustreDeploymentType.SCRATCH_1, LustreDeploymentType.SCRATCH_2].includes(deploymentType) && automaticBackupRetentionDays > 0) {
        throw new ValidationError('automatic backups is not supported on scratch file systems', this);
      }

      if (automaticBackupRetentionDays > 90) {
        throw new ValidationError(`automaticBackupRetention period must be between 0 and 90 days. received: ${automaticBackupRetentionDays}`, this);
      }
    }
  }

  /**
   * Validates the dailyAutomaticBackupStartTime is set with a non-zero day automaticBackupRetention.
   */
  private validateDailyAutomaticBackupStartTime(automaticBackupRetention?: Duration,
    dailyAutomaticBackupStartTime?: DailyAutomaticBackupStartTime): void {
    if (!dailyAutomaticBackupStartTime) return;

    const automaticBackupDisabled = !automaticBackupRetention || automaticBackupRetention?.toDays() === Duration.days(0).toDays();

    if (dailyAutomaticBackupStartTime && automaticBackupDisabled) {
      throw new ValidationError('automaticBackupRetention period must be set a non-zero day when dailyAutomaticBackupStartTime is set', this);
    }
  }
}
