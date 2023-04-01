/**
 * Properties for looking up an existing VPC.
 *
 * The combination of properties must specify filter down to exactly one
 * non-default VPC, otherwise an error is raised.
 */
export interface VpcLookupOptions {
  /**
   * The ID of the VPC
   *
   * If given, will import exactly this VPC.
   *
   * @default Don't filter on vpcId
   */
  readonly vpcId?: string;

  /**
   * The name of the VPC
   *
   * If given, will import the VPC with this name.
   *
   * @default Don't filter on vpcName
   */
  readonly vpcName?: string;

  /**
   * Tags on the VPC
   *
   * The VPC must have all of these tags
   *
   * @default Don't filter on tags
   */
  readonly tags?: {[key: string]: string};

  /**
   * Whether to match the default VPC
   *
   * @default Don't care whether we return the default VPC
   */
  readonly isDefault?: boolean;

  /**
   * Optional tag for subnet group name.
   * If not provided, we'll look at the aws-cdk:subnet-name tag.
   * If the subnet does not have the specified tag,
   * we'll use its type as the name.
   *
   * @default aws-cdk:subnet-name
   */
  readonly subnetGroupNameTag?: string;

  /**
   * Optional to override inferred region
   *
   * @default Current stack's environment region
   */
  readonly region?: string;

  /**
   * Whether to look up whether a VPN Gateway is attached to the looked up VPC.
   * You can set this to `false` if you know the VPC does not have a VPN Gateway
   * attached, in order to avoid an API call.
   *
   * If you change this property from `false` to `true` or undefined, you may
   * need to clear the corresponding context entry in `cdk.context.json` in
   * order to trigger a new lookup.
   *
   * @default true
   */
  readonly returnVpnGateways?: boolean;
}
