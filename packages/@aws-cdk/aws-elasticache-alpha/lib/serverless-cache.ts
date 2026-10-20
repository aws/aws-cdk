import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import { CfnServerlessCache } from 'aws-cdk-lib/aws-elasticache';
import type * as events from 'aws-cdk-lib/aws-events';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { Size } from 'aws-cdk-lib/core';
import { Annotations, ArnFormat, Stack, Lazy, ValidationError, Names, Token } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IServerlessCache } from './serverless-cache-base';
import { ServerlessCacheBase, CacheEngine } from './serverless-cache-base';
import type { IUserGroup } from './user-group';

const ELASTICACHE_SERVERLESSCACHE_SYMBOL = Symbol.for('@aws-cdk/aws-elasticache.ServerlessCache');

/**
 * Unit types for data storage usage limits
 */
enum DataStorageUnit {
  /**
   * Gigabytes
   */
  GIGABYTES = 'GB',
}

/**
 * Minimum data storage size in GB for ServerlessCache
 */
const DATA_STORAGE_MIN_GB = 1;
/**
 * Maximum data storage size in GB for ServerlessCache
 */
const DATA_STORAGE_MAX_GB = 5000;
/**
 * Minimum request rate limit in ECPUs per second for ServerlessCache
 */
const REQUEST_RATE_MIN_ECPU = 1000;
/**
 * Maximum request rate limit in ECPUs per second for ServerlessCache
 */
const REQUEST_RATE_MAX_ECPU = 15000000;
/**
 * Minimum Valkey major version that supports public endpoints
 */
const PUBLIC_CONNECTION_MIN_VALKEY_VERSION = 9;
/**
 * System-managed user group whose users all authenticate with IAM, used by default for public caches
 */
const DEFAULT_IAM_USER_GROUP_ID = 'default.iam-user-group';

/**
 * How clients connect to a ServerlessCache.
 *
 * To target a connection type that is not yet represented by a named instance,
 * use `ConnectionType.of(value)`.
 */
export class ConnectionType {
  /**
   * The cache is reachable only from within a VPC, through the subnets and security groups it is placed in.
   */
  public static readonly VPC = ConnectionType.of('vpc');

  /**
   * The cache is reachable through a public endpoint, without a VPC.
   */
  public static readonly PUBLIC = ConnectionType.of('public');

  /**
   * Create a new `ConnectionType` with an arbitrary value.
   *
   * @param value the connection type (for example, `'vpc'` or `'public'`)
   */
  public static of(value: string): ConnectionType {
    return new ConnectionType(value);
  }

  /**
   * The connection type, for example `'vpc'` or `'public'`.
   * Maps directly to the `ConnectionType` property of `AWS::ElastiCache::ServerlessCache`.
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Returns the connection type as a string (for example, `'public'`).
   */
  public toString(): string {
    return this.value;
  }
}

/**
 * Usage limits configuration for ServerlessCache
 */
export interface CacheUsageLimitsProperty {
  /**
   * Minimum data storage size (1 GB)
   *
   * @default - No minimum limit
   */
  readonly dataStorageMinimumSize?: Size;
  /**
   * Maximum data storage size (5000 GB)
   *
   * @default - No maximum limit
   */
  readonly dataStorageMaximumSize?: Size;
  /**
   * Minimum request rate limit (1000 ECPUs per second)
   *
   * @default - No minimum limit
   */
  readonly requestRateLimitMinimum?: number;
  /**
   * Maximum request rate limit (15000000 ECPUs per second)
   *
   * @default - No maximum limit
   */
  readonly requestRateLimitMaximum?: number;
}

/**
 * Backup configuration for ServerlessCache
 */
export interface BackupSettings {
  /**
   * Automated daily backup UTC time
   *
   * @default - No automated backups
   */
  readonly backupTime?: events.Schedule;
  /**
   * Number of days to retain backups (1-35)
   *
   * @default - Backups are not retained
   */
  readonly backupRetentionLimit?: number;
  /**
   * Name for the final backup taken before deletion
   *
   * @default - No final backup
   */
  readonly backupNameBeforeDeletion?: string;
  /**
   * ARNs of backups from which to restore data into the new cache
   *
   * @default - Create a new cache with no existing data
   */
  readonly backupArnsToRestore?: string[];
}

/**
 * Properties for defining a ServerlessCache
 */
export interface ServerlessCacheProps {
  /**
   * The cache engine combined with the version
   * Enum options: VALKEY_DEFAULT, VALKEY_7, VALKEY_8, REDIS_DEFAULT, MEMCACHED_DEFAULT
   * The default options bring the latest versions available.
   *
   * @default when not provided, the default engine would be Valkey, latest version available (VALKEY_DEFAULT)
   */
  readonly engine?: CacheEngine;
  /**
   * Name for the serverless cache
   *
   * @default automatically generated name by Resource
   */
  readonly serverlessCacheName?: string;
  /**
   * A description for the cache
   *
   * @default - No description
   */
  readonly description?: string;
  /**
   * Usage limits for the cache
   *
   * @default - No usage limits
   */
  readonly cacheUsageLimits?: CacheUsageLimitsProperty;
  /**
   * Backup configuration
   *
   * @default - No backups configured
   */
  readonly backup?: BackupSettings;
  /**
   * KMS key for encryption
   *
   * @default - Service managed encryption (AWS owned KMS key)
   */
  readonly kmsKey?: kms.IKey;
  /**
   * How clients connect to the cache
   *
   * `ConnectionType.PUBLIC` makes the cache reachable over the internet without a VPC.
   * Public caches require Valkey 9 or later, and every user in the user group must use IAM authentication.
   *
   * The connection type cannot be changed after the cache is created.
   *
   * @see https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/serverless-public-endpoints-chapter.html
   * @default ConnectionType.VPC
   */
  readonly connectionType?: ConnectionType;
  /**
   * The VPC to place the cache in
   *
   * Required when `connectionType` is `ConnectionType.VPC`. Must not be set when `connectionType` is `ConnectionType.PUBLIC`.
   *
   * @default - No VPC. Only valid when `connectionType` is `ConnectionType.PUBLIC`
   */
  readonly vpc?: ec2.IVpc;
  /**
   * Which subnets to place the cache in
   *
   * Must not be set when `connectionType` is `ConnectionType.PUBLIC`.
   *
   * @default - Private subnets with egress
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
  /**
   * Security groups for the cache
   *
   * Must not be set when `connectionType` is `ConnectionType.PUBLIC`.
   *
   * @default - A new security group is created. No security group is used when `connectionType` is `ConnectionType.PUBLIC`
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
  /**
   * User group for access control
   *
   * @default - No user group. When `connectionType` is `ConnectionType.PUBLIC`, the system-managed `default.iam-user-group` is used
   */
  readonly userGroup?: IUserGroup;
}

/**
 * Attributes that can be specified when importing a ServerlessCache
 */
export interface ServerlessCacheAttributes {
  /**
   * The cache engine used by this cache
   *
   * @default - engine type is unknown
   */
  readonly engine?: CacheEngine;
  /**
   * The name of the serverless cache
   *
   * One of `serverlessCacheName` or `serverlessCacheArn` is required.
   *
   * @default - derived from serverlessCacheArn
   */
  readonly serverlessCacheName?: string;
  /**
   * The ARN of the serverless cache
   *
   * One of `serverlessCacheName` or `serverlessCacheArn` is required.
   *
   * @default - derived from serverlessCacheName
   */
  readonly serverlessCacheArn?: string;
  /**
   * The ARNs of backups restored in the cache
   *
   * @default - backups are unknown
   */
  readonly backupArnsToRestore?: string[];
  /**
   * The KMS key used for encryption
   *
   * @default - encryption key is unknown
   */
  readonly kmsKey?: kms.IKey;
  /**
   * The VPC this cache is deployed in
   *
   * @default - VPC is unknown
   */
  readonly vpc?: ec2.IVpc;
  /**
   * The subnets this cache is deployed in
   *
   * @default - subnets are unknown
   */
  readonly subnets?: ec2.ISubnet[];
  /**
   * The security groups associated with this cache
   *
   * @default - security groups are unknown
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
  /**
   * The user group associated with this cache
   *
   * @default - user group is unknown
   */
  readonly userGroup?: IUserGroup;
}

/**
 * A serverless ElastiCache cache
 *
 * @resource AWS::ElastiCache::ServerlessCache
 */
@propertyInjectable
export class ServerlessCache extends ServerlessCacheBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticache.ServerlessCache';

  /**
   * Return whether the given object is a `ServerlessCache`
   */
  public static isServerlessCache(x: any): x is ServerlessCache {
    return x !== null && typeof (x) === 'object' && ELASTICACHE_SERVERLESSCACHE_SYMBOL in x;
  }

  /**
   * Import an existing serverless cache by name
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param serverlessCacheName The name of the existing serverless cache
   */
  public static fromServerlessCacheName(scope: Construct, id: string, serverlessCacheName: string): IServerlessCache {
    return ServerlessCache.fromServerlessCacheAttributes(scope, id, { serverlessCacheName });
  }

  /**
   * Import an existing serverless cache by ARN
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param serverlessCacheArn The ARN of the existing serverless cache
   */
  public static fromServerlessCacheArn(scope: Construct, id: string, serverlessCacheArn: string): IServerlessCache {
    return ServerlessCache.fromServerlessCacheAttributes(scope, id, { serverlessCacheArn });
  }

  /**
   * Import an existing serverless cache using attributes
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param attrs A `ServerlessCacheAttributes` object
   */
  public static fromServerlessCacheAttributes(scope: Construct, id: string, attrs: ServerlessCacheAttributes): IServerlessCache {
    let name: string;
    let arn: string;
    const stack = Stack.of(scope);

    if (attrs.serverlessCacheArn && attrs.serverlessCacheName) {
      throw new ValidationError(lit`ConflictingCacheIdentifiers`, 'Only one of serverlessCacheArn or serverlessCacheName can be provided.', scope);
    }

    if (attrs.serverlessCacheArn) {
      arn = attrs.serverlessCacheArn;
      const extractedServerlessCacheName = stack.splitArn(attrs.serverlessCacheArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (!extractedServerlessCacheName) {
        throw new ValidationError(lit`InvalidCacheArn`, 'Unable to extract serverless cache name from ARN.', scope);
      }
      name = extractedServerlessCacheName;
    } else if (attrs.serverlessCacheName) {
      name = attrs.serverlessCacheName;
      arn = stack.formatArn({
        service: 'elasticache',
        resource: 'serverlesscache',
        resourceName: attrs.serverlessCacheName,
      });
    } else {
      throw new ValidationError(lit`MissingCacheIdentifier`, 'One of serverlessCacheName or serverlessCacheArn is required.', scope);
    }

    class Import extends ServerlessCacheBase {
      public readonly engine = attrs.engine;
      public readonly serverlessCacheName: string;
      public readonly serverlessCacheArn: string;
      public readonly backupArnsToRestore = attrs.backupArnsToRestore;
      public readonly kmsKey = attrs.kmsKey;
      public readonly vpc = attrs.vpc;
      public readonly subnets = attrs.subnets;
      public readonly securityGroups = attrs.securityGroups;
      public readonly userGroup = attrs.userGroup;

      public readonly connections: ec2.Connections;

      constructor(serverlessCacheArn: string, serverlessCacheName: string) {
        super(scope, id);
        this.serverlessCacheArn = serverlessCacheArn;
        this.serverlessCacheName = serverlessCacheName;

        if (this.engine) {
          let defaultPort: ec2.Port;
          switch (this.engine.engineType) {
            case 'valkey':
            case 'redis':
              // Document showing the default port
              // https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/set-up.html#elasticache-install-grant-access-VPN
              defaultPort = ec2.Port.tcp(6379);
              break;
            case 'memcached':
              // Document showing the default port
              // https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/set-up.html#elasticache-install-grant-access-VPN
              defaultPort = ec2.Port.tcp(11211);
              break;
            default:
              throw new ValidationError(lit`UnsupportedCacheEngine`, `Unsupported cache engine: ${this.engine}`, scope);
          }

          this.connections = new ec2.Connections({
            securityGroups: this.securityGroups,
            defaultPort: defaultPort,
          });
        } else {
          this.connections = new ec2.Connections({
            securityGroups: this.securityGroups,
          });
        }
      }
    }

    return new Import(arn, name);
  }

  public readonly engine?: CacheEngine;
  public readonly serverlessCacheName: string;
  public readonly backupArnsToRestore?: string[];
  public readonly kmsKey?: kms.IKey;
  public readonly vpc?: ec2.IVpc;
  public readonly subnets?: ec2.ISubnet[];
  public readonly securityGroups?: ec2.ISecurityGroup[];
  public readonly userGroup?: IUserGroup;

  /**
   * The ARN of the serverless cache
   *
   * @attribute
   */
  public readonly serverlessCacheArn: string;
  /**
   * The endpoint address of the serverless cache
   *
   * @attribute
   */
  public readonly serverlessCacheEndpointAddress: string;
  /**
   * The endpoint port of the serverless cache
   *
   * @attribute
   */
  public readonly serverlessCacheEndpointPort: string;
  /**
   * The reader endpoint address of the serverless cache
   *
   * @attribute
   */
  public readonly serverlessCacheReaderEndpointAddress: string;
  /**
   * The reader endpoint port of the serverless cache
   *
   * @attribute
   */
  public readonly serverlessCacheReaderEndpointPort: string;
  /**
   * The current status of the serverless cache
   * Can be 'CREATING', 'AVAILABLE', 'DELETING', 'CREATE-FAILED', 'MODIFYING'
   *
   * @attribute
   */
  public readonly serverlessCacheStatus: string;

  /**
   * Access to network connections
   */
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: ServerlessCacheProps = {}) {
    super(scope, id, {});

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.engine = props.engine ?? CacheEngine.VALKEY_LATEST;
    this.serverlessCacheName = props.serverlessCacheName ?? Lazy.string({
      produce: () => Names.uniqueResourceName(this, { maxLength: 40 }),
    });
    this.kmsKey = props.kmsKey;
    this.vpc = props.vpc;
    this.userGroup = props.userGroup;

    this.validateDescription(props.description);
    this.validateDataStorageLimits(props.cacheUsageLimits);
    this.validateRequestRateLimits(props.cacheUsageLimits);
    this.validateBackupSettings(props.backup);
    this.validateUserGroupCompatibility(this.engine, this.userGroup);

    let subnetIds: string[] | undefined;
    let securityGroupIds: string[] | undefined;
    const isPublic = props.connectionType?.value === ConnectionType.PUBLIC.value;
    if (isPublic) {
      this.validatePublicConnection(props, this.engine);
      Annotations.of(this).addWarningV2('@aws-cdk/aws-elasticache-alpha:publicServerlessCache',
        'This serverless cache uses a public endpoint and is reachable from the internet. Access is controlled by IAM authentication only.');
    } else {
      if (!props.vpc) {
        throw new ValidationError(lit`VpcRequired`, 'vpc is required when connectionType is not ConnectionType.PUBLIC', this);
      }

      const subnetConfig = this.configureSubnets(props.vpc, props.vpcSubnets);
      subnetIds = subnetConfig.subnetIds;
      this.subnets = subnetConfig.subnets;

      const securityGroupConfig = this.configureSecurityGroups(props.vpc, props.securityGroups);
      securityGroupIds = securityGroupConfig.securityGroupIds;
      this.securityGroups = securityGroupConfig.securityGroups;
    }

    const resource = new CfnServerlessCache(this, 'Resource', {
      engine: this.engine.engineType,
      majorEngineVersion: this.engine.majorEngineVersion,
      serverlessCacheName: this.serverlessCacheName,
      description: props.description,
      cacheUsageLimits: this.renderCacheUsageLimits(props.cacheUsageLimits),
      dailySnapshotTime: props.backup?.backupTime ? this.formatBackupTime(props.backup.backupTime) : undefined,
      snapshotRetentionLimit: props.backup?.backupRetentionLimit,
      finalSnapshotName: props.backup?.backupNameBeforeDeletion,
      snapshotArnsToRestore: props.backup?.backupArnsToRestore,
      kmsKeyId: props.kmsKey?.keyId,
      subnetIds: subnetIds,
      securityGroupIds: securityGroupIds,
      userGroupId: props.userGroup?.userGroupName ?? (isPublic ? DEFAULT_IAM_USER_GROUP_ID : undefined),
      connectionType: props.connectionType?.value,
    });

    if (props.userGroup) {
      const userGroupResource = props.userGroup.node.findChild('Resource') as CfnUserGroup;
      resource.addResourceDependency(userGroupResource);
    }

    this.backupArnsToRestore = resource.snapshotArnsToRestore;
    this.serverlessCacheArn = resource.attrArn;
    this.serverlessCacheEndpointAddress = resource.attrEndpointAddress;
    this.serverlessCacheEndpointPort = resource.attrEndpointPort;
    this.serverlessCacheReaderEndpointAddress = resource.attrReaderEndpointAddress;
    this.serverlessCacheReaderEndpointPort = resource.attrReaderEndpointPort;
    this.serverlessCacheStatus = resource.attrStatus;

    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(Token.asNumber(this.serverlessCacheEndpointPort)),
    });

    Object.defineProperty(this, ELASTICACHE_SERVERLESSCACHE_SYMBOL, { value: true });
  }

  /**
   * Validate description meets AWS requirements
   *
   * @param description The description to validate
   */
  private validateDescription(description?: string): void {
    if (!description || Token.isUnresolved(description)) return;

    if (description.length > 255) {
      throw new ValidationError(lit`DescriptionTooLong`, `Description must not exceed 255 characters, currently has ${description.length}`, this);
    }

    if (description.includes('<') || description.includes('>')) {
      throw new ValidationError(lit`InvalidDescriptionCharacters`, 'Description must not contain < or > characters', this);
    }
  }

  /**
   * Validate data storage size limits
   *
   * @param limits The usage limits containing data storage settings
   */
  private validateDataStorageLimits(limits?: CacheUsageLimitsProperty): void {
    if (!limits) return;

    if (limits.dataStorageMinimumSize && !limits.dataStorageMinimumSize.isUnresolved() &&
      (limits.dataStorageMinimumSize.toGibibytes() < DATA_STORAGE_MIN_GB || limits.dataStorageMinimumSize.toGibibytes() > DATA_STORAGE_MAX_GB)) {
      throw new ValidationError(lit`InvalidDataStorageMinimum`, 'Data storage minimum must be between 1 and 5000 GB.', this);
    }
    if (limits.dataStorageMaximumSize && !limits.dataStorageMaximumSize.isUnresolved() &&
      (limits.dataStorageMaximumSize.toGibibytes() < DATA_STORAGE_MIN_GB || limits.dataStorageMaximumSize.toGibibytes() > DATA_STORAGE_MAX_GB)) {
      throw new ValidationError(lit`InvalidDataStorageMaximum`, 'Data storage maximum must be between 1 and 5000 GB.', this);
    }

    if (limits.dataStorageMinimumSize && limits.dataStorageMaximumSize &&
      !limits.dataStorageMinimumSize.isUnresolved() && !limits.dataStorageMaximumSize.isUnresolved() &&
      limits.dataStorageMinimumSize.toGibibytes() > limits.dataStorageMaximumSize.toGibibytes()) {
      throw new ValidationError(lit`InvalidDataStorageRange`, 'Data storage minimum cannot be greater than maximum', this);
    }
  }

  /**
   * Validate request rate limits
   *
   * @param limits The usage limits containing request rate settings
   */
  private validateRequestRateLimits(limits?: CacheUsageLimitsProperty): void {
    if (!limits) return;

    if (limits.requestRateLimitMinimum !== undefined && !Token.isUnresolved(limits.requestRateLimitMinimum) &&
      (limits.requestRateLimitMinimum < REQUEST_RATE_MIN_ECPU || limits.requestRateLimitMinimum > REQUEST_RATE_MAX_ECPU)) {
      throw new ValidationError(lit`InvalidRequestRateMinimum`, 'Request rate minimum must be between 1,000 and 15,000,000 ECPUs per second', this);
    }
    if (limits.requestRateLimitMaximum !== undefined && !Token.isUnresolved(limits.requestRateLimitMaximum) &&
      (limits.requestRateLimitMaximum < REQUEST_RATE_MIN_ECPU || limits.requestRateLimitMaximum > REQUEST_RATE_MAX_ECPU)) {
      throw new ValidationError(lit`InvalidRequestRateMaximum`, 'Request rate maximum must be between 1,000 and 15,000,000 ECPUs per second', this);
    }

    if (!Token.isUnresolved(limits.requestRateLimitMinimum) && !Token.isUnresolved(limits.requestRateLimitMaximum) &&
      limits.requestRateLimitMinimum !== undefined && limits.requestRateLimitMaximum !== undefined &&
      limits.requestRateLimitMinimum > limits.requestRateLimitMaximum) {
      throw new ValidationError(lit`InvalidRequestRateRange`, 'Request rate minimum cannot be greater than maximum', this);
    }
  }

  /**
   * Validate backup settings meet AWS requirements
   *
   * @param backup The backup settings to validate
   */
  private validateBackupSettings(backup?: BackupSettings): void {
    if (!Token.isUnresolved(backup?.backupRetentionLimit) && backup?.backupRetentionLimit !== undefined) {
      const limit = backup.backupRetentionLimit;
      if (limit < 1 || limit > 35) {
        throw new ValidationError(lit`InvalidBackupRetentionLimit`, 'Backup retention limit must be between 1 and 35 days', this);
      }
    }

    if (!Token.isUnresolved(backup?.backupNameBeforeDeletion) && backup?.backupNameBeforeDeletion !== undefined) {
      const name = backup.backupNameBeforeDeletion;

      if (!/^[a-zA-Z]/.test(name)) {
        throw new ValidationError(lit`InvalidBackupNameStart`, 'Final backup name must begin with a letter', this);
      }

      if (!/^[a-zA-Z0-9-]+$/.test(name)) {
        throw new ValidationError(lit`InvalidBackupNameCharacters`, 'Final backup name must contain only ASCII letters, digits, and hyphens', this);
      }

      if (name.endsWith('-')) {
        throw new ValidationError(lit`InvalidBackupNameEnd`, 'Final backup name must not end with a hyphen', this);
      }

      if (name.includes('--')) {
        throw new ValidationError(lit`InvalidBackupNameConsecutiveHyphens`, 'Final backup name must not contain two consecutive hyphens', this);
      }
    }
  }

  /**
   * Validate user group compatibility with cache engine
   *
   * @param engine The cache engine
   * @param userGroup The user group to validate
   */
  private validateUserGroupCompatibility(engine: CacheEngine, userGroup?: IUserGroup): void {
    if (!userGroup) return;

    if (engine.engineType === 'memcached') {
      throw new ValidationError(lit`MemcachedUserGroupNotSupported`, 'User groups cannot be used with Memcached engines. Only Redis and Valkey engines support user groups.', this);
    }

    if (engine.engineType === 'redis' && userGroup.engine?.engineType !== 'redis') {
      throw new ValidationError(lit`RedisUserGroupMismatch`, 'Redis cache can only use Redis user groups.', this);
    }
  }

  /**
   * Validate that a public cache has no VPC configuration and uses a supported engine
   *
   * @param props The ServerlessCache properties
   * @param engine The cache engine
   */
  private validatePublicConnection(props: ServerlessCacheProps, engine: CacheEngine): void {
    if (props.vpc !== undefined || props.vpcSubnets !== undefined || props.securityGroups !== undefined) {
      throw new ValidationError(lit`PublicCacheVpcConfiguration`, 'vpc, vpcSubnets and securityGroups must not be set when connectionType is ConnectionType.PUBLIC, remove them or use ConnectionType.VPC', this);
    }

    if (engine.engineType !== 'valkey') {
      throw new ValidationError(lit`PublicCacheUnsupportedEngine`, `ConnectionType.PUBLIC requires the valkey engine, got ${JSON.stringify(engine.engineType)}`, this);
    }

    const majorEngineVersion = engine.majorEngineVersion;
    if (majorEngineVersion !== undefined && !Token.isUnresolved(majorEngineVersion) &&
      Number(majorEngineVersion) < PUBLIC_CONNECTION_MIN_VALKEY_VERSION) {
      throw new ValidationError(lit`PublicCacheUnsupportedEngineVersion`, `ConnectionType.PUBLIC requires valkey ${PUBLIC_CONNECTION_MIN_VALKEY_VERSION} or later, got ${JSON.stringify(majorEngineVersion)}`, this);
    }
  }

  /**
   * Render cache usage limits for CloudFormation
   *
   * @param limits The usage limits to render
   * @returns CloudFormation-compatible usage limits object or undefined
   */
  private renderCacheUsageLimits(limits?: CacheUsageLimitsProperty): any {
    if (!limits) return undefined;

    const cacheUsageLimits: any = {};

    if (limits.dataStorageMinimumSize !== undefined || limits.dataStorageMaximumSize !== undefined) {
      cacheUsageLimits.dataStorage = {
        unit: DataStorageUnit.GIGABYTES,
        ...(limits.dataStorageMinimumSize !== undefined && { minimum: limits.dataStorageMinimumSize.toGibibytes() }),
        ...(limits.dataStorageMaximumSize !== undefined && { maximum: limits.dataStorageMaximumSize.toGibibytes() }),
      };
    }

    if (limits.requestRateLimitMinimum !== undefined || limits.requestRateLimitMaximum !== undefined) {
      cacheUsageLimits.ecpuPerSecond = {
        ...(limits.requestRateLimitMinimum !== undefined && { minimum: limits.requestRateLimitMinimum }),
        ...(limits.requestRateLimitMaximum !== undefined && { maximum: limits.requestRateLimitMaximum }),
      };
    }

    return Object.keys(cacheUsageLimits).length > 0 ? cacheUsageLimits : undefined;
  }

  /**
   * Configure subnets for the cache
   *
   * @param vpc The VPC to place the cache in
   * @param vpcSubnets Which subnets to place the cache in
   * @returns Object containing subnet IDs and subnet objects
   */
  private configureSubnets(vpc: ec2.IVpc, vpcSubnets?: ec2.SubnetSelection): { subnetIds: string[] | undefined; subnets: ec2.ISubnet[] | undefined } {
    let selectedSubnets;
    if (vpcSubnets) {
      selectedSubnets = vpc.selectSubnets(vpcSubnets);
    } else {
      selectedSubnets = vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      });
    }

    return {
      subnetIds: selectedSubnets.subnetIds.length > 0 ? selectedSubnets.subnetIds : undefined,
      subnets: selectedSubnets.subnets.length > 0 ? selectedSubnets.subnets : undefined,
    };
  }

  /**
   * Configure security groups for the cache
   *
   * @param vpc The VPC to create a security group in, when none are given
   * @param securityGroups Security groups for the cache
   * @returns Object containing security group IDs and security group objects
   */
  private configureSecurityGroups(
    vpc: ec2.IVpc,
    securityGroups?: ec2.ISecurityGroup[],
  ): { securityGroupIds: string[]; securityGroups: ec2.ISecurityGroup[] } {
    if (securityGroups && securityGroups.length > 0) {
      return {
        securityGroupIds: securityGroups.map(sg => sg.securityGroupId),
        securityGroups: securityGroups,
      };
    } else {
      const newSecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        description: `Security group for ${this.node.id} cache.`,
        vpc: vpc,
      });
      return {
        securityGroupIds: [newSecurityGroup.securityGroupId],
        securityGroups: [newSecurityGroup],
      };
    }
  }

  /**
   * Format schedule to HH:MM format for daily backups
   *
   * @param schedule The schedule to format
   * @returns Time string in HH:MM format
   */
  private formatBackupTime(schedule: events.Schedule): string {
    const WILD_CARD = '*';
    const [
      minuteExpression, hourExpression,
      dayExpression, monthExpression,
      weekDayExpression, yearExpression,
    ] = schedule.expressionString.substr(5).slice(0, -1).split(' ');

    if (dayExpression != WILD_CARD || monthExpression != WILD_CARD || yearExpression != WILD_CARD || weekDayExpression != '?') {
      throw new ValidationError(lit`UnsupportedBackupSchedule`, 'For now, only daily backup time is available (supports just hour and minute). Day, month, year, and weekDay are not allowed', this);
    }

    const hour = hourExpression == WILD_CARD ? '0' : hourExpression;
    const minute = minuteExpression == WILD_CARD ? '0' : minuteExpression;

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }
}
