/**
 * Indicates whether to use Availability Zone rebalancing for an ECS service.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-rebalancing.html
 */
export enum AvailabilityZoneRebalancing {
  /**
   * Availability zone rebalancing is enabled.
   */
  ENABLED = 'ENABLED',

  /**
   * Availability zone rebalancing is disabled.
   */
  DISABLED = 'DISABLED',
}
