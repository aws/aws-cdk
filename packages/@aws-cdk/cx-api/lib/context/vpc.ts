export const VPC_PROVIDER = 'vpc-provider';

/**
 * Query input for looking up a VPC
 */
export interface VpcContextQuery {
  /**
   * Query account
   */
  account?: string;

  /**
   * Query region
   */
  region?: string;

  /**
   * Filters to apply to the VPC
   *
   * Filter parameters are the same as passed to DescribeVpcs.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html
   */
  filter: {[key: string]: string};
}

/**
 * Properties of a discovered VPC
 */
export interface VpcContextResponse {

  /**
   * VPC id
   */
  vpcId: string;

  /**
   * AZs
   */
  availabilityZones: string[];

  /**
   * IDs of all public subnets
   *
   * Element count: #(availabilityZones) · #(publicGroups)
   */
  publicSubnetIds?: string[];

  /**
   * Name of public subnet groups
   *
   * Element count: #(publicGroups)
   */
  publicSubnetNames?: string[];

  /**
   * IDs of all private subnets
   *
   * Element count: #(availabilityZones) · #(privateGroups)
   */
  privateSubnetIds?: string[];

  /**
   * Name of private subnet groups
   *
   * Element count: #(privateGroups)
   */
  privateSubnetNames?: string[];

  /**
   * IDs of all isolated subnets
   *
   * Element count: #(availabilityZones) · #(isolatedGroups)
   */
  isolatedSubnetIds?: string[];

  /**
   * Name of isolated subnet groups
   *
   * Element count: #(isolatedGroups)
   */
  isolatedSubnetNames?: string[];

  /**
   * The VPN gateway ID
   */
  vpnGatewayId?: string;
}
