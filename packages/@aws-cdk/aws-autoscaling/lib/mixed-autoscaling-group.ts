import * as ec2 from '@aws-cdk/aws-ec2';
import { CfnAutoScalingGroup } from './autoscaling.generated';

/**
 * Base mixed instances policy for autoscaling group
 */
export interface MixedInstancesPolicyBase {
  /**
   * The instances distribution to use
   */
  readonly instanceDistribution: CfnAutoScalingGroup.InstancesDistributionProperty
}

/**
 * Mixed instances policy for autoscaling group
 */
export interface MixedInstancesPolicy extends MixedInstancesPolicyBase {
  /**
   * The instance types to override the value provided from launch template
   *
   */
   readonly overrideInstanceTypes: ec2.InstanceType[];
   /**
    * Indicates how to allocate Spot capacity across Spot pools.
    * If the allocation strategy is `lowest-price`, the Auto Scaling group launches instances using the Spot pools
    * with the lowest price, and evenly allocates your instances across the number of Spot pools that you specify.
    * If the allocation strategy is `capacity-optimized`, the Auto Scaling group launches instances using Spot pools
    * that are optimally chosen based on the available Spot capacity.
    *
    * @default lowest-price
    */
   readonly spotAllocationStrategy?: SpotAllocationStrategy;
}

/**
 * Spot allocation strategy for mixed autoscaling group
 */
export enum SpotAllocationStrategy {
  /**
   * Auto Scaling group launches instances using the Spot pools with the lowest price
   */
  LOWESTPRICE = 'lowest-price',
  /**
   * Auto Scaling group launches instances using Spot pools that are optimally chosen based on the available Spot capacity
   */
  CAPACITYOPTIMIZED = 'capacity-optimized'
}
