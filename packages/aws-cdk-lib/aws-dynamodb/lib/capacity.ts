import { CfnGlobalTable } from './dynamodb.generated';

/**
 * Capacity modes
 */
export enum CapacityMode {
  /**
   * Fixed
   */
  FIXED = 'FIXED',

  /**
   * Autoscaled
   */
  AUTOSCALED = 'AUTOSCALED',
}

/**
 * Options used to configure autoscaled capacity.
 */
export interface AutoscaledCapacityOptions {
  /**
   * The maximum allowable capacity.
   */
  readonly maxCapacity: number;

  /**
   * The minimum allowable capacity.
   *
   * @default 1
   */
  readonly minCapacity?: number;

  /**
   * The ratio of consumed capacity units to provisioned capacity units.
   *
   * Note: Target utilization percent cannot be less than 20 and cannot be greater
   * than 90.
   *
   * @default 70
   */
  readonly targetUtilizationPercent?: number;

  /**
   * If you want to switch a table's billing mode from on-demand to provisioned or
   * from provisioned to on-demand, you must specify a value for this property for
   * each autoscaled resource.
   *
   * @default no seed capacity
   */
  readonly seedCapacity?: number;
}

/**
 * Represents the amount of read and write operations supported by a DynamoDB table.
 */
export abstract class Capacity {
  /**
   * Provisioned throughput capacity is configured with fixed capacity units.
   *
   * Note: You cannot configure write capacity using fixed capacity mode.
   *
   * @param iops the number of I/O operations per second.
   */
  public static fixed(iops: number): Capacity {
    return new (class extends Capacity {
      public _renderReadCapacity() {
        return {
          readCapacityUnits: iops,
        } satisfies CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
      }

      public _renderWriteCapacity() {
        throw new Error(`You cannot configure 'writeCapacity' with ${CapacityMode.FIXED} capacity mode`);
      }
    }) (CapacityMode.FIXED);
  }

  /**
   * Dynamically adjusts provisioned throughput capacity on your behalf in response to actual
   * traffic patterns.
   *
   * @param options options used to configure autoscaled capacity mode.
   */
  public static autoscaled(options: AutoscaledCapacityOptions): Capacity {
    return new (class extends Capacity {
      public constructor(mode: CapacityMode) {
        super(mode);

        if ((options.minCapacity ?? 1) > options.maxCapacity) {
          throw new Error('`minCapacity` must be less than or equal to `maxCapacity`');
        }

        if (options.targetUtilizationPercent !== undefined && (options.targetUtilizationPercent < 20 || options.targetUtilizationPercent > 90)) {
          throw new Error('`targetUtilizationPercent` cannot be less than 20 or greater than 90');
        }

        if (options.seedCapacity !== undefined && (options.seedCapacity < 1)) {
          throw new Error(`'seedCapacity' cannot be less than 1 - received ${options.seedCapacity}`);
        }
      }

      public _renderReadCapacity() {
        return {
          readCapacityAutoScalingSettings: this.renderAutoscaledCapacity(),
        } satisfies CfnGlobalTable.ReadProvisionedThroughputSettingsProperty;
      }

      public _renderWriteCapacity() {
        return {
          writeCapacityAutoScalingSettings: this.renderAutoscaledCapacity(),
        } satisfies CfnGlobalTable.WriteProvisionedThroughputSettingsProperty;
      }

      private renderAutoscaledCapacity() {
        return {
          minCapacity: options.minCapacity ?? 1,
          maxCapacity: options.maxCapacity,
          seedCapacity: options.seedCapacity,
          targetTrackingScalingPolicyConfiguration: {
            targetValue: options.targetUtilizationPercent ?? 70,
          },
        };
      }

    }) (CapacityMode.AUTOSCALED);
  }

  private constructor(public readonly mode: CapacityMode) {}

  /**
   * @internal
   */
  public abstract _renderReadCapacity(): any;

  /**
   * @internal
   */
  public abstract _renderWriteCapacity(): any;
}
