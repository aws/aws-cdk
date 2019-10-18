export const VPC_PROVIDER = 'vpc-provider';

/**
 * Query input for looking up a VPC
 */
export interface VpcContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;

  /**
   * Filters to apply to the VPC
   *
   * Filter parameters are the same as passed to DescribeVpcs.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html
   */
  readonly filter: {[key: string]: string};
}

/**
 * Properties of a discovered VPC
 */
export interface VpcContextResponse {

  /**
   * VPC id
   */
  readonly vpcId: string;

  /**
   * AZs
   */
  readonly availabilityZones: string[];

  /**
   * IDs of all public subnets
   *
   * Element count: #(availabilityZones) · #(publicGroups)
   */
  readonly publicSubnetIds?: string[];

  /**
   * Name of public subnet groups
   *
   * Element count: #(publicGroups)
   */
  readonly publicSubnetNames?: string[];

  /**
   * Route Table IDs of public subnet groups.
   *
   * Element count: #(availabilityZones) · #(publicGroups)
   */
  readonly publicSubnetRouteTableIds?: string[];

  /**
   * IDs of all private subnets
   *
   * Element count: #(availabilityZones) · #(privateGroups)
   */
  readonly privateSubnetIds?: string[];

  /**
   * Name of private subnet groups
   *
   * Element count: #(privateGroups)
   */
  readonly privateSubnetNames?: string[];

  /**
   * Route Table IDs of private subnet groups.
   *
   * Element count: #(availabilityZones) · #(privateGroups)
   */
  readonly privateSubnetRouteTableIds?: string[];

  /**
   * IDs of all isolated subnets
   *
   * Element count: #(availabilityZones) · #(isolatedGroups)
   */
  readonly isolatedSubnetIds?: string[];

  /**
   * Name of isolated subnet groups
   *
   * Element count: #(isolatedGroups)
   */
  readonly isolatedSubnetNames?: string[];

  /**
   * Route Table IDs of isolated subnet groups.
   *
   * Element count: #(availabilityZones) · #(isolatedGroups)
   */
  readonly isolatedSubnetRouteTableIds?: string[];

  /**
   * The VPN gateway ID
   */
  readonly vpnGatewayId?: string;

  /**
   * The primary IPv4 CIDR block for the VPC.
   */
  readonly vpcCidrBlock?: string;

  /**
   * The IPv6 CIDR blocks associated with the VPC.
   */
  readonly vpcIpv6CidrBlocks?: string[];

}
