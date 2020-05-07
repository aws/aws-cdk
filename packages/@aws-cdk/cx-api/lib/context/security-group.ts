export const SECURITY_GROUP_PROVIDER = 'security-group';

/**
 * Query to security group context provider
 */
export interface SecurityGroupContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;

  /**
   * The VPCId to filter security groups by
   */
  readonly vpcId: string;

  /**
   * Filters to apply to the Security Group
   *
   * Filter parameters are the same as passed to DescribeSecurityGroups.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSecurityGroups.html
   */
  readonly filter: {[key: string]: string};
}

/**
 * Response from security group context provider
 */
export interface SecurityGroupContextResponse {

  /**
   * Security Group Id
   */
  readonly securityGroupId: string;
}
