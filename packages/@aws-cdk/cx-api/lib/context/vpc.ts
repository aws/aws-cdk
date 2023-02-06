/**
 * The type of subnet group.
 * Same as SubnetType in the @aws-cdk/aws-ec2 package,
 * but we can't use that because of cyclical dependencies.
 */
export enum VpcSubnetGroupType {
  /** Public subnet group type. */
  PUBLIC = 'Public',

  /** Private subnet group type. */
  PRIVATE = 'Private',

  /** Isolated subnet group type. */
  ISOLATED = 'Isolated',
}

/**
 * A subnet representation that the VPC provider uses.
 */
export interface VpcSubnet {
  /** The identifier of the subnet. */
  readonly subnetId: string;

  /**
   * The code of the availability zone this subnet is in
   * (for example, 'us-west-2a').
   */
  readonly availabilityZone: string;

  /** The identifier of the route table for this subnet. */
  readonly routeTableId: string;

  /**
   * CIDR range of the subnet
   *
   * @default - CIDR information not available
   */
  readonly cidr?: string;
}

/**
 * A group of subnets returned by the VPC provider.
 * The included subnets do NOT have to be symmetric!
 */
export interface VpcSubnetGroup {
  /**
   * The name of the subnet group,
   * determined by looking at the tags of of the subnets
   * that belong to it.
   */
  readonly name: string;

  /** The type of the subnet group. */
  readonly type: VpcSubnetGroupType;

  /**
   * The subnets that are part of this group.
   * There is no condition that the subnets have to be symmetric
   * in the group.
   */
  readonly subnets: VpcSubnet[];
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
   * VPC cidr
   *
   * @default - CIDR information not available
   */
  readonly vpcCidrBlock?: string;

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
   * The subnet groups discovered for the given VPC.
   * Unlike the above properties, this will include asymmetric subnets,
   * if the VPC has any.
   * This property will only be populated if `VpcContextQuery.returnAsymmetricSubnets`
   * is true.
   *
   * @default - no subnet groups will be returned unless `VpcContextQuery.returnAsymmetricSubnets` is true
   */
  readonly subnetGroups?: VpcSubnetGroup[];

  /**
   * The region in which the VPC is in.
   *
   * @default - Region of the parent stack
   */
  readonly region?: string;
}
