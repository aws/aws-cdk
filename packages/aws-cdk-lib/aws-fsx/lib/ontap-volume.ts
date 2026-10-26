import type { Construct } from 'constructs';
import { CfnVolume } from './fsx.generated';
import type { IOntapStorageVirtualMachine, SecurityStyle } from './ontap-storage-virtual-machine';
import type { Duration, IResolvable, IResource } from '../../core';
import { RemovalPolicy, Resource, Token, Tokenization, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Convert a boolean (or boolean token) to its CloudFormation string representation
 * (`'true'` or `'false'`). For `IResolvable` tokens we delegate to `Token.asString`
 * so the runtime resolution returns the actual `'true'`/`'false'` string rather
 * than the token's own string form.
 */
function stringifyBoolean(value: boolean | IResolvable): string {
  if (Token.isUnresolved(value)) {
    return Token.asString(value);
  }
  return value ? 'true' : 'false';
}

/**
 * Compares two RetentionPeriods for ordering.
 *
 * Returns -1 if a < b, 0 if a == b, 1 if a > b, or undefined when the
 * comparison cannot be reliably determined.
 *
 * INFINITE is treated as strictly greater than any finite period.
 * UNSPECIFIED bounds, unresolved tokens, missing values, and cross-unit
 * comparisons all return undefined and skip the ordering check. Cross-unit
 * comparisons are skipped because converting between units requires calendar
 * approximations (1 month = 30 days, 1 year = 365 days) that produce false
 * positives at unit boundaries. The FSx service performs the authoritative
 * cross-unit validation at deploy time.
 */
function compareRetentionPeriods(
  a: { type: string; value?: number },
  b: { type: string; value?: number },
): number | undefined {
  if (a.type === 'UNSPECIFIED' || b.type === 'UNSPECIFIED') return undefined;
  if (a.type === 'INFINITE' && b.type === 'INFINITE') return 0;
  if (a.type === 'INFINITE') return 1;
  if (b.type === 'INFINITE') return -1;
  if (a.value === undefined || b.value === undefined) return undefined;
  if (Token.isUnresolved(a.value) || Token.isUnresolved(b.value)) return undefined;
  if (a.type !== b.type) return undefined;
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
}

/**
 * The ONTAP volume type.
 */
export enum OntapVolumeType {
  /** Read/write volume (default) */
  RW = 'RW',
  /** Data-protection volume (read-only, SnapMirror destination) */
  DP = 'DP',
}

/**
 * The style of ONTAP volume.
 */
export enum VolumeStyle {
  /** Traditional single-aggregate volume */
  FLEXVOL = 'FLEXVOL',
  /** Multi-aggregate volume for large workloads */
  FLEXGROUP = 'FLEXGROUP',
}

/**
 * Tiering policy names for ONTAP volumes.
 */
export enum TieringPolicyName {
  /** (Default) Only tier snapshot data to capacity pool */
  SNAPSHOT_ONLY = 'SNAPSHOT_ONLY',
  /** Tier cold user data and snapshots automatically */
  AUTO = 'AUTO',
  /** Tier all user data blocks to capacity pool */
  ALL = 'ALL',
  /** Keep all data in primary storage tier */
  NONE = 'NONE',
}

/**
 * The retention mode for an FSx for ONTAP SnapLock volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-snaplockconfiguration.html#cfn-fsx-volume-snaplockconfiguration-snaplocktype
 */
export enum SnaplockType {
  /**
   * Compliance mode. WORM files cannot be deleted by anyone (including SnapLock
   * administrators) until their retention periods expire. Use for regulatory
   * mandates and ransomware protection.
   */
  COMPLIANCE = 'COMPLIANCE',
  /**
   * Enterprise mode. WORM files can be deleted by authorized SnapLock administrators
   * before their retention periods expire via privileged delete.
   */
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * Privileged-delete state for FSx for ONTAP Enterprise SnapLock volumes.
 */
export enum PrivilegedDelete {
  /** Privileged delete is disabled (default). */
  DISABLED = 'DISABLED',
  /** Privileged delete is enabled. */
  ENABLED = 'ENABLED',
  /** Privileged delete is permanently disabled. Terminal state, cannot be re-enabled. */
  PERMANENTLY_DISABLED = 'PERMANENTLY_DISABLED',
}

/**
 * The unit type for an FSx for ONTAP SnapLock autocommit period.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-autocommitperiod.html
 */
export enum AutocommitPeriodType {
  /** Autocommit measured in minutes. Valid range 5-65535. */
  MINUTES = 'MINUTES',
  /** Autocommit measured in hours. Valid range 1-65535. */
  HOURS = 'HOURS',
  /** Autocommit measured in days. Valid range 1-3650. */
  DAYS = 'DAYS',
  /** Autocommit measured in months. Valid range 1-120. */
  MONTHS = 'MONTHS',
  /** Autocommit measured in years. Valid range 1-10. */
  YEARS = 'YEARS',
  /** Autocommit disabled (default). */
  NONE = 'NONE',
}

/**
 * The unit type for an FSx for ONTAP SnapLock retention period.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-retentionperiod.html
 */
export enum RetentionPeriodType {
  /** Retention measured in seconds. Valid range 0-65535. */
  SECONDS = 'SECONDS',
  /** Retention measured in minutes. Valid range 0-65535. */
  MINUTES = 'MINUTES',
  /** Retention measured in hours. Valid range 0-24. */
  HOURS = 'HOURS',
  /** Retention measured in days. Valid range 0-365. */
  DAYS = 'DAYS',
  /** Retention measured in months. Valid range 0-12. */
  MONTHS = 'MONTHS',
  /** Retention measured in years. Valid range 0-100. */
  YEARS = 'YEARS',
  /** Files retained forever. `value` must be unset. */
  INFINITE = 'INFINITE',
  /** Retention is unspecified, files retained until an explicit period is set. `value` must be unset. */
  UNSPECIFIED = 'UNSPECIFIED',
}

/**
 * The tiering policy for an ONTAP volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-tieringpolicy.html
 */
export interface TieringPolicy {
  /**
   * The tiering policy name.
   *
   * @default TieringPolicyName.SNAPSHOT_ONLY
   */
  readonly name?: TieringPolicyName;

  /**
   * The number of days before data is moved to the capacity pool.
   * Valid values: 2-183 days. Applies only to SNAPSHOT_ONLY and AUTO policies.
   *
   * @default - service default
   */
  readonly coolingPeriod?: Duration;
}

/**
 * Aggregate configuration for FlexGroup volumes.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-aggregateconfiguration.html
 */
export interface AggregateConfiguration {
  /**
   * The list of aggregates for the volume. Each entry must be formatted `aggrX`
   * where X is an integer between 1 and 12.
   *
   * @default - automatically selected
   */
  readonly aggregates?: string[];

  /**
   * The number of constituents per aggregate.
   *
   * Valid range: 1-200.
   *
   * @default - automatically determined
   */
  readonly constituentsPerAggregate?: number;
}

/**
 * Defines an autocommit period (Type + Value) for an FSx for ONTAP SnapLock volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-autocommitperiod.html
 */
export interface AutocommitPeriod {
  /**
   * The unit type. Setting `NONE` disables autocommit (default).
   */
  readonly type: AutocommitPeriodType;

  /**
   * The numeric value. Range varies by type:
   *
   * - MINUTES: 5-65535
   * - HOURS:   1-65535
   * - DAYS:    1-3650
   * - MONTHS:  1-120
   * - YEARS:   1-10
   *
   * Must be unset when `type` is `NONE`.
   *
   * @default - not set (only valid for `NONE`)
   */
  readonly value?: number;
}

/**
 * Defines a retention period (Type + Value) for an FSx for ONTAP SnapLock volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-retentionperiod.html
 */
export interface RetentionPeriod {
  /**
   * The unit type.
   */
  readonly type: RetentionPeriodType;

  /**
   * The numeric value. Range varies by type:
   *
   * - SECONDS: 0-65535
   * - MINUTES: 0-65535
   * - HOURS:   0-24
   * - DAYS:    0-365
   * - MONTHS:  0-12
   * - YEARS:   0-100
   *
   * Must be unset when `type` is `INFINITE` or `UNSPECIFIED`.
   *
   * @default - not set (only valid for `INFINITE` and `UNSPECIFIED`)
   */
  readonly value?: number;
}

/**
 * Default, minimum, and maximum retention periods for an FSx for ONTAP SnapLock volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-snaplockretentionperiod.html
 */
export interface SnaplockRetentionPeriod {
  /**
   * Default retention period applied to a WORM file when no explicit period is set.
   * Must satisfy `minimumRetention <= defaultRetention <= maximumRetention`.
   */
  readonly defaultRetention: RetentionPeriod;

  /**
   * The longest retention period that can be assigned to a WORM file on the volume.
   */
  readonly maximumRetention: RetentionPeriod;

  /**
   * The shortest retention period that can be assigned to a WORM file on the volume.
   */
  readonly minimumRetention: RetentionPeriod;
}

/**
 * SnapLock configuration for an FSx for ONTAP volume (WORM/compliance).
 *
 * SnapLock provides write-once, read-many (WORM) storage. Files transitioned to
 * WORM cannot be deleted (Compliance mode) or can only be deleted via privileged
 * delete by SnapLock administrators (Enterprise mode) until their retention
 * periods expire.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-volume-snaplockconfiguration.html
 */
export interface SnaplockConfiguration {
  /**
   * The retention mode of the SnapLock volume. Once set, this field cannot be changed.
   */
  readonly snaplockType: SnaplockType;

  /**
   * Whether the volume is an audit log volume. The minimum retention period for
   * audit log volumes is six months.
   *
   * @default false
   */
  readonly auditLogVolume?: boolean | IResolvable;

  /**
   * Autocommit period for transitioning files to WORM state.
   *
   * @default - autocommit disabled (Type=NONE)
   */
  readonly autocommitPeriod?: AutocommitPeriod;

  /**
   * Privileged delete configuration. Only valid for `ENTERPRISE` SnapLock volumes.
   *
   * @default PrivilegedDelete.DISABLED
   */
  readonly privilegedDelete?: PrivilegedDelete;

  /**
   * Default, minimum, and maximum retention periods for the volume.
   *
   * @default - service defaults
   */
  readonly retentionPeriod?: SnaplockRetentionPeriod;

  /**
   * Whether to enable volume-append mode (creating WORM-appendable files).
   *
   * @default false
   */
  readonly volumeAppendModeEnabled?: boolean | IResolvable;
}

/**
 * Represents an FSx for NetApp ONTAP Volume.
 */
export interface IOntapVolume extends IResource {
  /**
   * The ID of the volume.
   * @attribute
   */
  readonly volumeId: string;

  /**
   * The ARN of the volume.
   * @attribute
   */
  readonly resourceArn: string;

  /**
   * The system-generated UUID of the volume.
   * @attribute
   */
  readonly uuid: string;
}

/**
 * Properties for creating an FSx for NetApp ONTAP Volume.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html
 */
export interface OntapVolumeProps {
  /**
   * The SVM that this volume belongs to.
   */
  readonly storageVirtualMachine: IOntapStorageVirtualMachine;

  /**
   * The name of the volume.
   */
  readonly name: string;

  /**
   * The size of the volume, in bytes.
   *
   * Maximum approximately 9 PiB (`2^53 - 1`) due to JavaScript number precision.
   * For volumes larger than this, supply the value as a CloudFormation parameter
   * or token instead of a literal `number`.
   */
  readonly sizeInBytes: number;

  /**
   * The ID of an existing FSx for ONTAP volume backup to create this volume from.
   *
   * @default - create an empty volume
   */
  readonly backupId?: string;

  /**
   * The location in the SVM's namespace where the volume is mounted.
   * Must have a leading forward slash (e.g., `/vol1`).
   *
   * @default - no junction path (volume not accessible via NAS)
   */
  readonly junctionPath?: string;

  /**
   * Whether to enable storage efficiency (deduplication, compression, compaction).
   *
   * Only valid for RW (read/write) volumes; DP (data-protection) volumes do not
   * accept this property.
   *
   * Accepts a boolean or a boolean-typed `IResolvable` token (for example,
   * a `CfnParameter` whose value resolves to `'true'`/`'false'` at deploy time).
   *
   * @default true for RW volumes; not set for DP volumes
   */
  readonly storageEfficiencyEnabled?: boolean | IResolvable;

  /**
   * The tiering policy for the volume.
   *
   * @default - SNAPSHOT_ONLY
   */
  readonly tieringPolicy?: TieringPolicy;

  /**
   * The security style for the volume.
   *
   * @default - inherited from SVM root volume
   */
  readonly securityStyle?: SecurityStyle;

  /**
   * The snapshot policy for the volume.
   *
   * @default 'default'
   */
  readonly snapshotPolicy?: string;

  /**
   * The type of volume.
   *
   * @default OntapVolumeType.RW
   */
  readonly ontapVolumeType?: OntapVolumeType;

  /**
   * The volume style (FlexVol or FlexGroup).
   *
   * FlexGroup volumes require `aggregateConfiguration` to be set; FlexVol volumes
   * must not have `aggregateConfiguration`.
   *
   * @default VolumeStyle.FLEXVOL
   */
  readonly volumeStyle?: VolumeStyle;

  /**
   * Whether to copy tags to backups.
   *
   * Accepts a boolean or a boolean-typed `IResolvable` token (for example,
   * a `CfnParameter` whose value resolves to `'true'`/`'false'` at deploy time).
   *
   * @default false
   */
  readonly copyTagsToBackups?: boolean | IResolvable;

  /**
   * Aggregate configuration. Required for FlexGroup volumes; not allowed for
   * FlexVol volumes.
   *
   * @default - none (only allowed for FlexGroup volumes)
   */
  readonly aggregateConfiguration?: AggregateConfiguration;

  /**
   * SnapLock configuration for WORM (write-once, read-many) compliance.
   *
   * @default - SnapLock disabled
   */
  readonly snaplockConfiguration?: SnaplockConfiguration;

  /**
   * Policy to apply when the volume is removed from the stack.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * The FSx for NetApp ONTAP Volume construct.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-volume.html
 *
 * @resource AWS::FSx::Volume
 */
@propertyInjectable
export class OntapVolume extends Resource implements IOntapVolume {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.OntapVolume';

  /**
   * The ID of the volume.
   * @attribute
   */
  public readonly volumeId: string;

  /**
   * The ARN of the volume.
   * @attribute
   */
  public readonly resourceArn: string;

  /**
   * The system-generated UUID of the volume.
   * @attribute
   */
  public readonly uuid: string;

  private readonly volume: CfnVolume;

  constructor(scope: Construct, id: string, props: OntapVolumeProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateProps(props);

    const volumeType = props.ontapVolumeType ?? OntapVolumeType.RW;
    // DP volumes do not accept storageEfficiencyEnabled, only RW volumes do.
    const storageEfficiencyEnabled = volumeType === OntapVolumeType.DP
      ? undefined
      : stringifyBoolean(props.storageEfficiencyEnabled ?? true);

    this.volume = new CfnVolume(this, 'Resource', {
      name: props.name,
      backupId: props.backupId,
      volumeType: 'ONTAP',
      ontapConfiguration: {
        storageVirtualMachineId: props.storageVirtualMachine.storageVirtualMachineId,
        junctionPath: props.junctionPath,
        sizeInBytes: Tokenization.stringifyNumber(props.sizeInBytes),
        storageEfficiencyEnabled,
        securityStyle: props.securityStyle,
        snapshotPolicy: props.snapshotPolicy,
        ontapVolumeType: props.ontapVolumeType,
        volumeStyle: props.volumeStyle,
        copyTagsToBackups: props.copyTagsToBackups === undefined
          ? undefined
          : stringifyBoolean(props.copyTagsToBackups),
        tieringPolicy: props.tieringPolicy ? {
          name: props.tieringPolicy.name,
          coolingPeriod: props.tieringPolicy.coolingPeriod?.toDays(),
        } : undefined,
        aggregateConfiguration: props.aggregateConfiguration ? {
          aggregates: props.aggregateConfiguration.aggregates,
          constituentsPerAggregate: props.aggregateConfiguration.constituentsPerAggregate,
        } : undefined,
        snaplockConfiguration: props.snaplockConfiguration
          ? this.renderSnaplockConfiguration(props.snaplockConfiguration)
          : undefined,
      },
    });

    // Default to RETAIN because volumes are stateful: dropping a volume on stack
    // delete would silently destroy customer data. Users can opt in to DESTROY
    // explicitly if their workload tolerates that.
    this.volume.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    this.volumeId = this.volume.ref;
    this.resourceArn = this.volume.attrResourceArn;
    this.uuid = this.volume.attrUuid;
  }

  private renderSnaplockConfiguration(snaplock: SnaplockConfiguration): CfnVolume.SnaplockConfigurationProperty {
    return {
      snaplockType: snaplock.snaplockType,
      auditLogVolume: snaplock.auditLogVolume === undefined ? undefined : stringifyBoolean(snaplock.auditLogVolume),
      privilegedDelete: snaplock.privilegedDelete,
      volumeAppendModeEnabled: snaplock.volumeAppendModeEnabled === undefined ? undefined : stringifyBoolean(snaplock.volumeAppendModeEnabled),
      autocommitPeriod: snaplock.autocommitPeriod ? {
        type: snaplock.autocommitPeriod.type,
        value: snaplock.autocommitPeriod.value,
      } : undefined,
      retentionPeriod: snaplock.retentionPeriod ? {
        defaultRetention: this.renderRetentionPeriod(snaplock.retentionPeriod.defaultRetention),
        maximumRetention: this.renderRetentionPeriod(snaplock.retentionPeriod.maximumRetention),
        minimumRetention: this.renderRetentionPeriod(snaplock.retentionPeriod.minimumRetention),
      } : undefined,
    };
  }

  private renderRetentionPeriod(rp: RetentionPeriod): CfnVolume.RetentionPeriodProperty {
    return { type: rp.type, value: rp.value };
  }

  private validateProps(props: OntapVolumeProps): void {
    this.validateName(props.name);
    this.validateJunctionPath(props.junctionPath);
    this.validateSizeInBytes(props.sizeInBytes);
    this.validateCoolingPeriod(props.tieringPolicy);
    this.validateVolumeStyleAndAggregate(props.volumeStyle, props.aggregateConfiguration);
    this.validateAggregateConfiguration(props.aggregateConfiguration);
    this.validateStorageEfficiencyForVolumeType(props.ontapVolumeType, props.storageEfficiencyEnabled);
    this.validateSnaplockConfiguration(props.snaplockConfiguration);
  }

  private validateName(name: string): void {
    if (Token.isUnresolved(name)) return;
    if (name.length < 1 || name.length > 203) {
      throw new ValidationError(lit`VolumeNameLength`, `'name' must be between 1 and 203 characters, got ${name.length}`, this);
    }
    // FSx for ONTAP service rule (stricter than the CloudFormation property pattern):
    // a volume name must begin with a letter or underscore, may contain only ASCII
    // alphanumerics and underscore, and is at most 203 characters. Hyphens, dots,
    // spaces, and other punctuation are rejected at deploy time with an opaque
    // BadRequest from FSx; surface it at synth so the offending value is obvious.
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      throw new ValidationError(
        lit`VolumeNameInvalidCharacters`,
        `'name' must begin with a letter or underscore and contain only ASCII letters, digits, and underscores, got '${name}'`,
        this,
      );
    }
  }

  private validateSizeInBytes(sizeInBytes: number): void {
    if (Token.isUnresolved(sizeInBytes)) return;
    // JavaScript numbers lose precision past Number.MAX_SAFE_INTEGER (2^53 - 1, ~9 PiB).
    // Pass a CfnParameter token (or other IResolvable number) for volumes larger than that.
    if (!Number.isSafeInteger(sizeInBytes)) {
      throw new ValidationError(
        lit`SizeInBytesNotSafeInteger`,
        `'sizeInBytes' literal must be a safe integer (at most ${Number.MAX_SAFE_INTEGER}); pass a CfnParameter or token for larger volumes, got ${sizeInBytes}`,
        this,
      );
    }
    // FSx for ONTAP rejects SizeInBytes=0 with InvalidParameterCombination at deploy time;
    // require a positive integer at synth so the error is clearly attributed to the prop.
    if (sizeInBytes <= 0) {
      throw new ValidationError(
        lit`SizeInBytesMustBePositive`,
        `'sizeInBytes' must be a positive integer, got ${sizeInBytes}`,
        this,
      );
    }
    // FSx for ONTAP enforces a 20 MiB per-volume minimum; smaller values fail at deploy
    // with `BadRequest`. Catch this at synth so the error is clearly attributed.
    const FSX_MIN_VOLUME_BYTES = 20 * 1024 * 1024;
    if (sizeInBytes < FSX_MIN_VOLUME_BYTES) {
      throw new ValidationError(
        lit`SizeInBytesBelowFsxMin`,
        `'sizeInBytes' must be at least ${FSX_MIN_VOLUME_BYTES} bytes (20 MiB) for FSx for ONTAP volumes, got ${sizeInBytes}`,
        this,
      );
    }
  }

  private validateJunctionPath(junctionPath?: string): void {
    // `undefined` means the user didn't set it; that's fine, the CFN property is optional.
    // An empty string, however, is a user-provided value that the service rejects with
    // an opaque `BadRequest` at deploy time, so flag it explicitly here. Treat the two
    // cases distinctly rather than collapsing them under a single `!junctionPath` guard.
    if (junctionPath === undefined) return;
    if (Token.isUnresolved(junctionPath)) return;
    if (!junctionPath.startsWith('/')) {
      throw new ValidationError(lit`JunctionPathMustStartWithSlash`, `'junctionPath' must start with '/', got '${junctionPath}'`, this);
    }
    if (junctionPath.length > 255) {
      throw new ValidationError(lit`JunctionPathLength`, `'junctionPath' must be at most 255 characters, got ${junctionPath.length}`, this);
    }
    // FSx for ONTAP rejects the SVM root namespace (`/`), trailing slashes, and
    // double slashes at deploy time with `BadRequest`. Catch them at synth so the
    // error is clearly attributed to the prop.
    if (junctionPath === '/') {
      throw new ValidationError(lit`JunctionPathRootReserved`, '\'junctionPath\' cannot be \'/\' (reserved for the SVM root namespace)', this);
    }
    if (junctionPath.length > 1 && junctionPath.endsWith('/')) {
      throw new ValidationError(lit`JunctionPathTrailingSlash`, `'junctionPath' must not end with '/', got '${junctionPath}'`, this);
    }
    if (junctionPath.includes('//')) {
      throw new ValidationError(lit`JunctionPathDoubleSlash`, `'junctionPath' must not contain consecutive '/' characters, got '${junctionPath}'`, this);
    }
  }

  private validateCoolingPeriod(tieringPolicy?: TieringPolicy): void {
    if (!tieringPolicy?.coolingPeriod) return;
    if (tieringPolicy.name === TieringPolicyName.ALL || tieringPolicy.name === TieringPolicyName.NONE) {
      throw new ValidationError(lit`CoolingPeriodIncompatibleWithPolicy`, `'coolingPeriod' can only be set when tiering policy is SNAPSHOT_ONLY or AUTO, got '${tieringPolicy.name}'`, this);
    }
    if (Token.isUnresolved(tieringPolicy.coolingPeriod.toDays())) return;
    const days = tieringPolicy.coolingPeriod.toDays();
    if (!Number.isInteger(days) || days < 2 || days > 183) {
      throw new ValidationError(lit`CoolingPeriodRange`, `'coolingPeriod' must be a whole number of days between 2 and 183, got ${days}`, this);
    }
  }

  private validateVolumeStyleAndAggregate(volumeStyle?: VolumeStyle, aggregateConfiguration?: AggregateConfiguration): void {
    const isFlexGroup = volumeStyle === VolumeStyle.FLEXGROUP;
    if (isFlexGroup && !aggregateConfiguration) {
      throw new ValidationError(lit`FlexGroupRequiresAggregateConfiguration`, '\'aggregateConfiguration\' must be set when \'volumeStyle\' is FLEXGROUP', this);
    }
    if (!isFlexGroup && aggregateConfiguration) {
      throw new ValidationError(lit`AggregateConfigurationOnlyForFlexGroup`, '\'aggregateConfiguration\' can only be set when \'volumeStyle\' is FLEXGROUP', this);
    }
  }

  private validateAggregateConfiguration(aggregateConfiguration?: AggregateConfiguration): void {
    if (!aggregateConfiguration) return;
    // CFN: aggregates max 6, format `aggrX` where X in [1,12]
    if (aggregateConfiguration.aggregates) {
      // FSx accepts 1-6 aggregates. An empty list also fails at deploy with `BadRequest`.
      if (aggregateConfiguration.aggregates.length < 1 || aggregateConfiguration.aggregates.length > 6) {
        throw new ValidationError(
          lit`AggregatesLength`,
          `'aggregates' must contain between 1 and 6 entries, got ${aggregateConfiguration.aggregates.length}`,
          this,
        );
      }
      for (const aggr of aggregateConfiguration.aggregates) {
        if (Token.isUnresolved(aggr)) continue;
        if (!/^aggr([1-9]|1[0-2])$/.test(aggr)) {
          throw new ValidationError(
            lit`AggregateInvalidFormat`,
            `'aggregates' entries must match the pattern 'aggrX' where X is between 1 and 12, got '${aggr}'`,
            this,
          );
        }
      }
    }
    // CFN: constituentsPerAggregate range 1-200
    if (aggregateConfiguration.constituentsPerAggregate != null
        && !Token.isUnresolved(aggregateConfiguration.constituentsPerAggregate)) {
      const c = aggregateConfiguration.constituentsPerAggregate;
      if (!Number.isInteger(c) || c < 1 || c > 200) {
        throw new ValidationError(
          lit`ConstituentsPerAggregateRange`,
          `'constituentsPerAggregate' must be an integer between 1 and 200, got ${c}`,
          this,
        );
      }
    }
  }

  private validateStorageEfficiencyForVolumeType(volumeType?: OntapVolumeType, storageEfficiencyEnabled?: boolean | IResolvable): void {
    if (volumeType === OntapVolumeType.DP && storageEfficiencyEnabled !== undefined) {
      throw new ValidationError(lit`StorageEfficiencyNotAllowedForDp`, '\'storageEfficiencyEnabled\' cannot be set on DP (data-protection) volumes', this);
    }
  }

  private validateSnaplockConfiguration(snaplock?: SnaplockConfiguration): void {
    if (!snaplock) return;
    // privilegedDelete only valid for ENTERPRISE
    if (snaplock.privilegedDelete !== undefined && snaplock.snaplockType !== SnaplockType.ENTERPRISE) {
      throw new ValidationError(
        lit`PrivilegedDeleteOnlyForEnterprise`,
        '\'privilegedDelete\' can only be set when \'snaplockType\' is ENTERPRISE',
        this,
      );
    }
    if (snaplock.autocommitPeriod) {
      this.validateAutocommitPeriod(snaplock.autocommitPeriod);
    }
    if (snaplock.retentionPeriod) {
      this.validateRetentionPeriod(snaplock.retentionPeriod.defaultRetention, 'defaultRetention');
      this.validateRetentionPeriod(snaplock.retentionPeriod.minimumRetention, 'minimumRetention');
      this.validateRetentionPeriod(snaplock.retentionPeriod.maximumRetention, 'maximumRetention');
      this.validateRetentionPeriodOrdering(snaplock.retentionPeriod);
    }
  }

  /**
   * Validates that minimumRetention <= defaultRetention <= maximumRetention.
   *
   * Comparisons are performed only between retention periods that share the
   * same unit type (e.g. both DAYS or both YEARS). Cross-unit comparisons,
   * UNSPECIFIED retentions, and unresolved tokens are skipped and left to the
   * FSx service to validate at deploy time. INFINITE is treated as strictly
   * greater than any finite period.
   */
  private validateRetentionPeriodOrdering(rp: SnaplockRetentionPeriod): void {
    const minVsDef = compareRetentionPeriods(rp.minimumRetention, rp.defaultRetention);
    if (minVsDef !== undefined && minVsDef > 0) {
      throw new ValidationError(
        lit`RetentionPeriodOrdering`,
        '\'retentionPeriod.minimumRetention\' must be less than or equal to \'retentionPeriod.defaultRetention\'',
        this,
      );
    }
    const defVsMax = compareRetentionPeriods(rp.defaultRetention, rp.maximumRetention);
    if (defVsMax !== undefined && defVsMax > 0) {
      throw new ValidationError(
        lit`RetentionPeriodOrdering`,
        '\'retentionPeriod.defaultRetention\' must be less than or equal to \'retentionPeriod.maximumRetention\'',
        this,
      );
    }
    const minVsMax = compareRetentionPeriods(rp.minimumRetention, rp.maximumRetention);
    if (minVsMax !== undefined && minVsMax > 0) {
      throw new ValidationError(
        lit`RetentionPeriodOrdering`,
        '\'retentionPeriod.minimumRetention\' must be less than or equal to \'retentionPeriod.maximumRetention\'',
        this,
      );
    }
  }

  private validateAutocommitPeriod(ap: AutocommitPeriod): void {
    if (ap.type === AutocommitPeriodType.NONE) {
      if (ap.value !== undefined) {
        throw new ValidationError(
          lit`AutocommitValueWithNone`,
          '\'autocommitPeriod.value\' must not be set when type is NONE',
          this,
        );
      }
      return;
    }
    // For all unit types (MINUTES, HOURS, DAYS, MONTHS, YEARS) `value` is required.
    // Catch the misconfiguration at synth so users see a clear CDK-side error instead
    // of a confusing CFN-side failure at deploy time.
    if (ap.value === undefined) {
      throw new ValidationError(
        lit`AutocommitValueRequired`,
        `'autocommitPeriod.value' is required when type is ${ap.type}`,
        this,
      );
    }
    if (Token.isUnresolved(ap.value)) return;
    const ranges: Record<AutocommitPeriodType, [number, number]> = {
      [AutocommitPeriodType.MINUTES]: [5, 65535],
      [AutocommitPeriodType.HOURS]: [1, 65535],
      [AutocommitPeriodType.DAYS]: [1, 3650],
      [AutocommitPeriodType.MONTHS]: [1, 120],
      [AutocommitPeriodType.YEARS]: [1, 10],
      [AutocommitPeriodType.NONE]: [0, 0], // unreachable
    };
    const [min, max] = ranges[ap.type];
    if (!Number.isInteger(ap.value) || ap.value < min || ap.value > max) {
      throw new ValidationError(
        lit`AutocommitValueRange`,
        `'autocommitPeriod.value' for type ${ap.type} must be an integer between ${min} and ${max}, got ${ap.value}`,
        this,
      );
    }
  }

  private validateRetentionPeriod(rp: RetentionPeriod, fieldName: string): void {
    const isUnitless = rp.type === RetentionPeriodType.INFINITE || rp.type === RetentionPeriodType.UNSPECIFIED;
    if (isUnitless) {
      if (rp.value !== undefined) {
        throw new ValidationError(
          lit`RetentionValueWithUnitless`,
          `'retentionPeriod.${fieldName}.value' must not be set when type is INFINITE or UNSPECIFIED`,
          this,
        );
      }
      return;
    }
    // For all unit types (SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS) `value` is required.
    // Catch the misconfiguration at synth so users see a clear CDK-side error instead
    // of a confusing CFN-side failure at deploy time.
    if (rp.value === undefined) {
      throw new ValidationError(
        lit`RetentionValueRequired`,
        `'retentionPeriod.${fieldName}.value' is required when type is ${rp.type}`,
        this,
      );
    }
    if (Token.isUnresolved(rp.value)) return;
    const ranges: Record<RetentionPeriodType, [number, number]> = {
      [RetentionPeriodType.SECONDS]: [0, 65535],
      [RetentionPeriodType.MINUTES]: [0, 65535],
      [RetentionPeriodType.HOURS]: [0, 24],
      [RetentionPeriodType.DAYS]: [0, 365],
      [RetentionPeriodType.MONTHS]: [0, 12],
      [RetentionPeriodType.YEARS]: [0, 100],
      [RetentionPeriodType.INFINITE]: [0, 0], // unreachable
      [RetentionPeriodType.UNSPECIFIED]: [0, 0], // unreachable
    };
    const [min, max] = ranges[rp.type];
    if (!Number.isInteger(rp.value) || rp.value < min || rp.value > max) {
      throw new ValidationError(
        lit`RetentionValueRange`,
        `'retentionPeriod.${fieldName}.value' for type ${rp.type} must be an integer between ${min} and ${max}, got ${rp.value}`,
        this,
      );
    }
  }
}
