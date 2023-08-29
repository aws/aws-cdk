import { Capacity } from './capacity';
import { BillingMode } from './shared';

/**
 * Properties used to configure provisioned throughput for a DynamoDB table.
 */
export interface ThroughputProps {
  /**
   * The read capacity.
   */
  readonly readCapacity: Capacity;

  /**
   * The write capacity.
   */
  readonly writeCapacity: Capacity;
}

/**
 * Represents how capacity is managed and how you are charged for read and write throughput
 * for a DynamoDB table.
 */
export abstract class Billing {
  /**
   * Flexible billing option capable of serving requests without capacity planning.
   *
   * Note: Billing mode will be PAY_PER_REQUEST.
   */
  public static onDemand(): Billing {
    return new (class extends Billing {
      public _renderReadCapacity() {
        return undefined;
      }

      public _renderWriteCapacity() {
        return undefined;
      }
    }) (BillingMode.PAY_PER_REQUEST);
  }

  /**
   * Specify the number of reads and writes per second that you need for your application.
   *
   * @param props specifiy read and write capacity configurations.
   */
  public static provisioned(props: ThroughputProps): Billing {
    return new (class extends Billing {
      public _renderReadCapacity() {
        return props.readCapacity._renderReadCapacity();
      }

      public _renderWriteCapacity() {
        return props.writeCapacity._renderWriteCapacity();
      }
    }) (BillingMode.PROVISIONED);
  }

  private constructor (public readonly mode: BillingMode) {}

  /**
   * @internal
   */
  public abstract _renderReadCapacity(): any;

  /**
   * @internal
   */
  public abstract _renderWriteCapacity(): any;
}
