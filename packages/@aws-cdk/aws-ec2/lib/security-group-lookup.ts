/**
 * Properties for looking up an existing SecurityGroup.
 *
 * The combination of properties must specify filter down to exactly one
 * security group, otherwise an error is raised.
 */
export interface SecurityGroupLookupOptions {
  /**
   * The VPC Id the security group belongs to
   *
   */
  readonly vpcId: string;

  /**
   * Filters on the Security Group
   *
   * Must be specific enough to only return one security group
   *
   */
  readonly filter: {[key: string]: string};
}
