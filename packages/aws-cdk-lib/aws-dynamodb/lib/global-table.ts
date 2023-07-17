import { Construct } from 'constructs';
import { IResource, Resource } from '../../core';
import {
  TableClass, SecondaryIndexProps, SchemaOptions, Attribute,
} from './table';

/**
 * Capacity modes used for read and write operations.
 */
export enum CapacityMode {
  /**
   * Fixed capacity mode.
   */
  FIXED = 'FIXED',

  /**
   * Autoscaled capacity mode.
   */
  AUTOSCALED = 'AUTOSCALED',
}

/**
 * Options used to configure autoscaled capacity mode.
 */
export interface AutoscaledCapacityOptions {
  /**
   * The minimum capacity to scale to.
   */
  readonly minCapacity: number;

  /**
   * The maximum capacity to scale to.
   */
  readonly maxCapacity: number;

  /**
   * The ratio of consumed capacity units to provisioned capacity units.
   *
   * @default 70
   */
  readonly targetUtilizationPercent?: number;
}

/**
 * Options used to configure a global secondary index.
 */
export interface GlobalSecondaryIndexOptions extends SecondaryIndexProps, SchemaOptions {
  /**
   * The read capacity for the global secondary index.
   *
   * Note: This can only be provided if the table billing is provisioned.
   *
   * @default - inherited from global table
   */
  readonly readCapacity?: Capacity;

  /**
   * The write capacity for the global secondary index.
   *
   * Note: This can only be provided if the table billing is on-demand.
   *
   * @default - inherited from global table
   */
  readonly writeCapacity?: Capacity;
}

/**
 * Options used to configure a local secondary index.
 */
export interface LocalSecondaryIndexOptions extends SecondaryIndexProps {
  /**
   * The attribute of a sort key for the local secondary index.
   */
  readonly sortKey: Attribute;
}

/**
 * Common configuration options between a global table and its replicas.
 */
interface TableOptions {
  /**
   * Whether or not CloudWatch contributor insights is enabled for all replicas in the
   * global table.
   *
   * Note: This property is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly constributorInsights?: boolean;

  /**
   * Whether or not deletion protection is enabled for all replicas in the global table.
   *
   * Note: This property is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether or not point-in-time recovery is enabled for all replicas in the global table.
   *
   * Note: This property is configurable on a per-replica basis.
   *
   * @default false
   */
  readonly pointInTimeRecovery?: boolean;

  /**
   * The table class for all replicas in the global table.
   *
   * Note: This property is configurable on a per-replica basis
   *
   * @default TableClass.STANDARD
   */
  readonly tableClass?: TableClass
}

/**
 * Options used to configure a replica table.
 */
export interface ReplicaTableOptions extends TableOptions {}

/**
 * Properties of a global table.
 */
export interface GlobalTableProps extends TableOptions, SchemaOptions {
  readonly tableName?: string;
}

export interface IGlobalTable extends IResource {}

abstract class GlobalTableBase extends Resource implements IGlobalTable {}

export class GlobalTable extends GlobalTableBase {
  public constructor(scope: Construct, id: string, props: GlobalTableProps) {
    super(scope, id, { physicalName: props.tableName });
  }
}

/**
 * The capacity mode and settings for read and write operations.
 */
export class Capacity {
  /**
   * Used to configure fixed capacity mode with specific capacity units.
   */
  public static fixed(units: number) {
    return new Capacity(CapacityMode.FIXED);
  }

  /**
   * Used to configure autoscaled capacity mode with capacity autoscaled setting.
   */
  public static autoscaled(options: AutoscaledCapacityOptions) {
    return new Capacity(CapacityMode.AUTOSCALED);
  }

  /**
   * The capacity mode for read and write operations.
   */
  public readonly mode: string;

  /**
   * The number of capacity units.
   *
   * Note: This is only set when the capacity mode is fixed.
   */
  public readonly units?: number;

  /**
   * The minimum capacity to scale to.
   *
   * Note: This is only set when the capacity mode is fixed.
   */
  public readonly minCapacity?: number;

  /**
   * The maximum capacity to scale to.
   *
   * Note: This is only set when the capacity mode is fixed.
   */
  public readonly maxCapacity?: number;

  public readonly targetUtilizationPercent?: number;

  private constructor(mode: string) {
    this.mode = mode;
  }
}
