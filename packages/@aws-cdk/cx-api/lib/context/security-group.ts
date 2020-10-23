
/**
 * Properties of a discovered SecurityGroup.
 */
export interface SecurityGroupContextResponse {
  /**
   * The security group's id.
   */
  readonly securityGroupId: string;

  /**
   * Whether the security group of the load balancer allows all outbound
   * traffic.
   */
  readonly allowAllOutbound: boolean;
}
