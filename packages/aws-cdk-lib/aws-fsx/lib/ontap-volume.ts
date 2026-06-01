import type { Construct } from 'constructs';
import { CfnVolume } from './fsx.generated';
import type { IOntapStorageVirtualMachine, SecurityStyle } from './ontap-storage-virtual-machine';
import type { Duration, RemovalPolicy } from '../../core';
import { Resource, Token, Tokenization, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

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
   * The list of aggregates for the volume.
   *
   * @default - automatically selected
   */
  readonly aggregates?: string[];

  /**
   * The number of constituents per aggregate.
   *
   * @default - automatically determined
   */
  readonly constituentsPerAggregate?: number;
}

/**
 * Represents an FSx for NetApp ONTAP Volume.
 */
export interface IOntapVolume {
  /**
   * The ID of the volume.
   * @attribute
   */
  readonly volumeId: string;
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
   */
  readonly sizeInBytes: number;

  /**
   * The location in the SVM's namespace where the volume is mounted.
   * Must have a leading forward slash (e.g., `/vol1`).
   *
   * @default - no junction path (volume not accessible via NAS)
   */
  readonly junctionPath?: string;

  /**
   * Whether to enable storage efficiency (deduplication, compression, compaction).
   * Required when `ontapVolumeType` is RW.
   *
   * @default true
   */
  readonly storageEfficiencyEnabled?: boolean;

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
   * @default VolumeStyle.FLEXVOL
   */
  readonly volumeStyle?: VolumeStyle;

  /**
   * Whether to copy tags to backups.
   *
   * @default false
   */
  readonly copyTagsToBackups?: boolean;

  /**
   * Aggregate configuration for FlexGroup volumes.
   *
   * @default - automatically configured
   */
  readonly aggregateConfiguration?: AggregateConfiguration;

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

  private readonly volume: CfnVolume;

  constructor(scope: Construct, id: string, props: OntapVolumeProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateProps(props);

    this.volume = new CfnVolume(this, 'Resource', {
      name: props.name,
      volumeType: 'ONTAP',
      ontapConfiguration: {
        storageVirtualMachineId: props.storageVirtualMachine.storageVirtualMachineId,
        junctionPath: props.junctionPath,
        sizeInBytes: Tokenization.stringifyNumber(props.sizeInBytes),
        storageEfficiencyEnabled: Token.isUnresolved(props.storageEfficiencyEnabled)
          ? (props.storageEfficiencyEnabled as unknown as string)
          : (props.storageEfficiencyEnabled ?? true).toString(),
        securityStyle: props.securityStyle,
        snapshotPolicy: props.snapshotPolicy,
        ontapVolumeType: props.ontapVolumeType,
        volumeStyle: props.volumeStyle,
        copyTagsToBackups: props.copyTagsToBackups != null
          ? (Token.isUnresolved(props.copyTagsToBackups)
            ? (props.copyTagsToBackups as unknown as string)
            : props.copyTagsToBackups.toString())
          : undefined,
        tieringPolicy: props.tieringPolicy ? {
          name: props.tieringPolicy.name,
          coolingPeriod: props.tieringPolicy.coolingPeriod?.toDays(),
        } : undefined,
        aggregateConfiguration: props.aggregateConfiguration ? {
          aggregates: props.aggregateConfiguration.aggregates,
          constituentsPerAggregate: props.aggregateConfiguration.constituentsPerAggregate,
        } : undefined,
      },
    });

    this.volume.applyRemovalPolicy(props.removalPolicy);

    this.volumeId = this.volume.ref;
    this.resourceArn = this.volume.attrResourceArn;
  }

  private validateProps(props: OntapVolumeProps): void {
    this.validateName(props.name);
    this.validateJunctionPath(props.junctionPath);
    this.validateCoolingPeriod(props.tieringPolicy);
  }

  private validateName(name: string): void {
    if (Token.isUnresolved(name)) return;
    if (name.length < 1 || name.length > 203) {
      throw new ValidationError(lit`VolumeNameLength`, `'name' must be between 1 and 203 characters, got ${name.length}`, this);
    }
  }

  private validateJunctionPath(junctionPath?: string): void {
    if (!junctionPath || Token.isUnresolved(junctionPath)) return;
    if (!junctionPath.startsWith('/')) {
      throw new ValidationError(lit`JunctionPathMustStartWithSlash`, `'junctionPath' must start with '/', got '${junctionPath}'`, this);
    }
    if (junctionPath.length > 255) {
      throw new ValidationError(lit`JunctionPathLength`, `'junctionPath' must be at most 255 characters, got ${junctionPath.length}`, this);
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
}
