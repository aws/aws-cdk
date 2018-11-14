export const VPC_PROVIDER = 'vpc-provider';

export interface VpcContextQuery {
  /**
   * Query account
   */
  account?: string;

  /**
   * Query region
   */
  region?: string;

  vpcId?: string;
  vpcName?: string;
  tags?: {[key: string]: string};
  isDefault?: boolean;
}

export interface VpcContextResponse {
  vpcId: string;
  availabilityZones: string[];
  publicSubnetIds?: string[];
  publicSubnetNames?: string[];
  privateSubnetIds?: string[];
  privateSubnetNames?: string[];
  isolatedSubnetIds?: string[];
  isolatedSubnetNames?: string[];
}